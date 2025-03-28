import './index.css';
import './contractABI.js';

document.addEventListener('DOMContentLoaded', function() {
    // Setup event listeners for the homepage
    const verifyProductBtn = document.getElementById('verify-product-btn');
    if (verifyProductBtn) {
        verifyProductBtn.addEventListener('click', verifyProduct);
    }

    // Product verification function
    async function verifyProduct() {
        const productIdInput = document.getElementById('product-id-input');
        const verificationResult = document.getElementById('verification-result');
        
        if (!productIdInput || !verificationResult) return;
        
        const productId = parseInt(productIdInput.value);
        
        if (isNaN(productId) || productId <= 0) {
            verificationResult.innerHTML = `
                <div class="alert alert-danger mt-3">
                    Please enter a valid product ID.
                </div>
            `;
            return;
        }
        
        try {
            verificationResult.innerHTML = `
                <div class="d-flex justify-content-center mt-3">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `;
            
            // Check if MetaMask is connected
            if (!window.isMetaMaskConnected) {
                throw new Error("Please connect to MetaMask first to verify the product.");
            }
            
            // Get product details
            const product = await window.contract.methods.getProductById(productId).call();
            
            // Get product history
            const history = await window.contract.methods.getTrackingHistory(productId).call();
            
            // Format the output
            const statusNames = [
                "Created", "Produced", "Shipped to Distributor", "Received by Distributor", 
                "Shipped to Retailer", "Received by Retailer", "Available", "Sold"
            ];
            
            // Get latest status
            const latestStatus = statusNames[product.status] || "Unknown";
            const isAuthentic = history.length > 0;
            
            verificationResult.innerHTML = `
                <div class="alert ${isAuthentic ? 'alert-success' : 'alert-danger'} mt-3">
                    <h5 class="alert-heading">${isAuthentic ? 'Authentic Product' : 'Product Not Verified'}</h5>
                    ${isAuthentic ? `
                        <p><strong>Product ID:</strong> ${productId}</p>
                        <p><strong>Name:</strong> ${product.name}</p>
                        <p><strong>Current Status:</strong> ${latestStatus}</p>
                        <p><strong>Supply Chain Events:</strong> ${history.length}</p>
                        <hr>
                        <p class="mb-0">This product has verified tracking information on the blockchain.</p>
                    ` : `
                        <p>The product ID ${productId} could not be verified on the blockchain.</p>
                        <p class="mb-0">Please check the ID and try again, or contact support.</p>
                    `}
                </div>
                ${isAuthentic ? `
                    <div class="mt-3">
                        <h6>Supply Chain Timeline</h6>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Location</th>
                                        <th>Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${history.map(event => `
                                        <tr>
                                            <td>${new Date(event.timestamp * 1000).toLocaleString()}</td>
                                            <td>${statusNames[event.status] || "Unknown"}</td>
                                            <td>${event.location || "-"}</td>
                                            <td>${event.comments || "-"}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : ''}
            `;
            
        } catch (error) {
            console.error('Error verifying product:', error);
            verificationResult.innerHTML = `
                <div class="alert alert-danger mt-3">
                    Error verifying product: ${error.message}
                </div>
            `;
        }
    }
});
