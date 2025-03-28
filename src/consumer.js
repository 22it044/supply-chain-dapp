import { isUserLoggedIn, getCurrentUser } from './auth';

var abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_pname",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			}
		],
		"name": "addNewProductsInList",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_oid",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_status",
				"type": "string"
			}
		],
		"name": "giveOrderItsStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pid",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_newPrice",
				"type": "uint256"
			}
		],
		"name": "newPrice",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_pid",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_quantity",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_cname",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_daddress",
				"type": "string"
			}
		],
		"name": "placeAnOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "registerNewProducer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "getMyTotalOrder",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_oid",
				"type": "uint256"
			}
		],
		"name": "getOrderByIdConsumer",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_oid",
				"type": "uint256"
			}
		],
		"name": "getOrderByIdProducer",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "getTotalOrder",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalOrder",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "getTotalProduct",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalProduct",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "isProducerRegistered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "orders",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "product_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "customer_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "delivery_address",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "customer_address",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "producers",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "product_name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "producer_address",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalOrder",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalProduct",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

var address = "0xCc10D8a7687051Ec063347555d7EA2Ee5722F26a";

web3 = new Web3(web3.currentProvider);
var contract = new web3.eth.Contract(abi, address);
console.log("blockchain connected")

$(document).ready(function () {
    // Check if user is authenticated as a consumer
    if (!isUserLoggedIn()) {
        // Hide consumer-specific sections
        $('#consumer-registration-section').hide();
        $('#available-products-section').hide();
        $('#my-orders-section').hide();
        
        // Show authentication required message
        $('<div class="alert alert-warning mt-4">Please login to access the consumer dashboard.</div>').insertAfter('.lead');
        return;
    }
    
    // Check if user is a consumer
    const currentUser = getCurrentUser();
    if (currentUser.userType !== 'consumer') {
        // Hide consumer-specific sections
        $('#consumer-registration-section').hide();
        $('#available-products-section').hide();
        $('#my-orders-section').hide();
        
        // Show unauthorized message
        $('<div class="alert alert-danger mt-4">You need to be registered as a consumer to access this dashboard.</div>').insertAfter('.lead');
        return;
    }

    // Setup connect button click
    $('#connect-button').click(async function() {
        await connectMetaMask();
    });

    // Initialize the contract implementation
    window.initContract = async function() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Modern dapp browsers
                window.web3 = new Web3(ethereum);
                console.log("Using modern Web3 with ethereum provider");
                
                // Get contract instance
                var contract = new web3.eth.Contract(abi, address);
                
                // Load products and orders
                loadAllProducts();
                loadConsumerOrders();
                
                return contract;
            } catch (error) {
                console.error("Error initializing contract:", error);
                return null;
            }
        } else if (window.web3) {
            // Legacy dapp browsers
            window.web3 = new Web3(web3.currentProvider);
            console.log("Using legacy Web3");
            var contract = new web3.eth.Contract(abi, address);
            return contract;
        } else {
            console.log('Non-Ethereum browser detected. Consider using MetaMask!');
            return null;
        }
    };

    // Check connection on page load
    checkConnection();

    // Add verify button click handler
    $('#_verifybtn').click(function() {
        verifyProduct();
    });
    
    // Add order button click handler
    $('#_orderbtn').click(function() {
        placeOrder();
    });
});

// Load all products
function loadAllProducts() {
    if(web3) {
        contract.methods.getTotalProduct().call()
        .then(function(result) {
            // Clear existing rows
            $('#_product_table tbody').empty();
            
            // If no products
            if(result == 0) {
                return;
            }
            
            // Load products
            for(var i=1; i<=result; i++) {
                loadProductById(i);
            }
        });
    }
}

// Load product by ID
function loadProductById(productId) {
    contract.methods.getProductById(productId).call()
    .then(function(product) {
        if(product[2] > 0) { // Only show products with quantity > 0
            var row = '<tr>' +
                '<th>' + product[0] + '</th>' +
                '<td>' + product[3] + '</td>' +
                '<td>' + product[1] + '</td>' +
                '<td>' + product[2] + '</td>' +
                '<td><button type="button" class="btn btn-secondary btn-sm" onclick="productOrderClick(' + product[0] + ')">Order</button></td>' +
                '</tr>';
            $('#_product_table tbody').append(row);
        }
    });
}

// Load consumer orders
function loadConsumerOrders() {
    if(web3) {
        ethereum.request({ method: 'eth_accounts' })
        .then(function(accounts){
            if(accounts.length === 0) return;
            
            contract.methods.getTotalOrder(accounts[0]).call()
            .then(function(result) {
                // Clear existing rows
                $('#_order_table tbody').empty();
                
                // If no orders
                if(result == 0) {
                    return;
                }
                
                // Load orders
                for(var i=1; i<=result; i++) {
                    loadOrderById(i, accounts[0]);
                }
            });
        });
    }
}

// Load order by ID
function loadOrderById(orderId, account) {
    contract.methods.getOrderByIdConsumer(account, orderId).call()
    .then(function(order) {
        if(order[3]) { // Check if order exists
            var row = '<tr>' +
                '<th>' + order[0] + '</th>' +
                '<td>' + order[2] + '</td>' +
                '<td>' + order[1] + '</td>' +
                '</tr>';
            $('#_order_table tbody').append(row);
        }
    });
}

// Place an order
function placeOrder() {
    var pid = document.getElementById("_pid").value;
    var quantity = document.getElementById("_quantity").value;
    var name = document.getElementById("_cname").value;
    var address = document.getElementById("_caddress").value;
    
    if(!web3) {
        alert("Please connect to MetaMask first!");
        return;
    }
    
    ethereum.request({ method: 'eth_accounts' })
    .then(function(accounts) {
        if(accounts.length === 0) {
            alert("Please connect to MetaMask first!");
            return;
        }
        
        contract.methods.placeAnOrder(pid, quantity, name, address).send({from: accounts[0]})
        .then(function(receipt) {
            console.log(receipt);
            alert("Order placed successfully!");
            loadConsumerOrders();
            loadAllProducts(); // Refresh products to update quantities
        })
        .catch(function(error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Make sure the product exists and has enough quantity.");
        });
    });
}

// Order product click handler
function productOrderClick(productId) {
    document.getElementById("_pid").value = productId;
    document.getElementById("_quantity").focus();
}

// Verify product authenticity
function verifyProduct() {
    var productId = document.getElementById("_verify_pid").value;
    
    if(!web3) {
        alert("Please connect to MetaMask first!");
        return;
    }
    
    if(!productId) {
        alert("Please enter a Product ID!");
        return;
    }
    
    // Get product details
    contract.methods.getProductById(productId).call()
    .then(function(product) {
        if(product[0] == 0) {
            $('#verification-result').html('<div class="alert alert-danger">Product not found!</div>');
        } else {
            // Get producer address for this product
            contract.methods.products(productId).call()
            .then(function(fullProduct) {
                var producerAddress = fullProduct.producer_address;
                
                // Get producer name
                contract.methods.producers(producerAddress).call()
                .then(function(producerName) {
                    var result = '<div class="alert alert-success">' +
                        '<p><strong>Product Verified!</strong></p>' +
                        '<p>Product Name: ' + product[3] + '</p>' +
                        '<p>Producer: ' + producerName + '</p>' +
                        '<p>Producer Address: ' + producerAddress + '</p>' +
                        '</div>';
                    $('#verification-result').html(result);
                });
            });
        }
    })
    .catch(function(error) {
        console.error("Error verifying product:", error);
        $('#verification-result').html('<div class="alert alert-danger">Error verifying product!</div>');
    });
}
