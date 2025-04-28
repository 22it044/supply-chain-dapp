// --- Core Firebase Modules ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, EmailAuthProvider, GoogleAuthProvider, PhoneAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, query, where, orderBy, onSnapshot, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-functions.js";

// --- FirebaseUI Modules ---
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css'; // Import FirebaseUI CSS

// --- Firebase Configuration ---
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWH1fNTeUw9iIhwmTYxOVqh0Ze7Lki-ik",
  authDomain: "dship-b9242.firebaseapp.com",
  projectId: "dship-b9242",
  storageBucket: "dship-b9242.firebasestorage.app",
  messagingSenderId: "857031646150",
  appId: "1:857031646150:web:68b6ed376d61c6c1b770c7",
  measurementId: "G-C296NY3LK2"
};


// --- Initialize Firebase Services ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
console.log("Firebase Initialized (script.js)");

// --- Get DOM Elements ---
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn'); // Used in showAppContent/showAuthContainer
const authContainer = document.getElementById('firebaseui-auth-container');
const appContent = document.getElementById('app-content');
const userEmailSpan = document.getElementById('user-email');
const welcomeMessage = document.querySelector('main > h1');
const loginPrompt = document.querySelector('main > p');
const itemForm = document.getElementById('item-form');
const itemsListDiv = document.getElementById('items-list');
const formMessage = document.getElementById('form-message');
const logoutButton = document.getElementById('logout-button');

// --- State Variables ---
let unsubscribeItemsListener = null; // To detach listener on logout

// --- FirebaseUI Config & Instance ---
const uiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    PhoneAuthProvider.PROVIDER_ID,
    GoogleAuthProvider.PROVIDER_ID
  ],
};
// Get the AuthUI instance Singleton, initializing if needed.
const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

// --- Cloud Function Definition ---
const mockSupplyChainUpdate = httpsCallable(functions, 'mockSupplyChainUpdate');

// --- Firestore Data Loading Function ---
function loadItems() {
    if (!auth.currentUser) {
        console.log("Not logged in, cannot load items.");
        if (unsubscribeItemsListener) {
          unsubscribeItemsListener();
          unsubscribeItemsListener = null;
        }
        if(itemsListDiv) itemsListDiv.innerHTML = 'Please log in to see items.';
        return;
    }
    if (unsubscribeItemsListener) {
      console.log("Firestore listener already active for this user.");
      return;
    }
    console.log("Setting up Firestore listener for user:", auth.currentUser.uid);
    if(itemsListDiv) itemsListDiv.innerHTML = 'Loading items...';
    const itemsQuery = query(
        collection(db, "items"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
    );
    unsubscribeItemsListener = onSnapshot(itemsQuery, (querySnapshot) => {
        console.log("Received Firestore update. Document count:", querySnapshot.size);
        if (!itemsListDiv) return;
        if (querySnapshot.empty) {
            itemsListDiv.innerHTML = '<p>No items logged yet.</p>';
            return;
        }
        let html = '<ul>';
        querySnapshot.forEach((doc) => {
            const item = doc.data();
            const ts = item.timestamp instanceof Timestamp ? item.timestamp.toDate().toLocaleString() : (item.timestamp ? 'Processing Date...' : 'No Date');
            const displayItemId = item.itemId || '[Missing ID]';
            const displayStatus = item.status || '[Missing Status]';
            html += `<li>ID: ${displayItemId} | Status: ${displayStatus} | Logged: ${ts}</li>`;
        });
        html += '</ul>';
        itemsListDiv.innerHTML = html;
    }, (error) => {
        console.error("Error getting items from Firestore:", error);
        if (itemsListDiv) itemsListDiv.innerHTML = `<p style="color: red;">Error loading items: ${error.message}</p>`;
        if (unsubscribeItemsListener) {
          unsubscribeItemsListener();
          unsubscribeItemsListener = null;
        }
    });
}

// --- UI Display Functions ---
function showAppContent(user) {
    console.log('User logged in:', user ? user.email : 'N/A');
    if(authContainer) authContainer.style.display = 'none';
    if(appContent) appContent.style.display = 'block';
    if(welcomeMessage) welcomeMessage.textContent = 'Mock DApp Portal';
    if(loginPrompt) loginPrompt.style.display = 'none';
    if(userEmailSpan && user) userEmailSpan.textContent = user.email;
    if(logoutBtn) logoutBtn.style.display = 'inline'; // Show header logout link
    if(logoutButton) logoutButton.style.display = 'inline'; // Show explicit logout button
    if(loginBtn) loginBtn.style.display = 'none';
    loadItems(); // Load items when user logs in
}

function showAuthContainer() {
    console.log('User logged out or not logged in.');
    if(authContainer) authContainer.style.display = 'block';
    if(appContent) appContent.style.display = 'none';
    if(welcomeMessage) welcomeMessage.textContent = 'Welcome';
    if(loginPrompt) loginPrompt.style.display = 'block';
    if(userEmailSpan) userEmailSpan.textContent = '';
    if(logoutBtn) logoutBtn.style.display = 'none';
    if(logoutButton) logoutButton.style.display = 'none'; // Hide explicit logout button
    if(loginBtn) loginBtn.style.display = 'inline';
    console.log('Attempting to start FirebaseUI...');
    ui.start('#firebaseui-auth-container', uiConfig);
    if (unsubscribeItemsListener) {
        unsubscribeItemsListener();
        unsubscribeItemsListener = null;
        console.log('Detached Firestore listener.');
    }
    if (itemsListDiv) itemsListDiv.innerHTML = '';
}

// --- Event Listeners ---
// Auth State Change Listener
onAuthStateChanged(auth, (user) => {
  console.log('onAuthStateChanged triggered. User:', user);
  if (user) {
    console.log('User is truthy, calling showAppContent');
    showAppContent(user);
  } else {
    console.log('User is falsy, calling showAuthContainer');
    showAuthContainer();
  }
});

// Form Submission Listener
if (itemForm) {
    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessage.textContent = 'Logging item...';
        formMessage.style.color = 'grey';
        const itemId = itemForm.itemId.value;
        const status = itemForm.status.value;
        if (!auth.currentUser) {
            formMessage.textContent = 'Error: You must be logged in.';
            formMessage.style.color = 'red';
            return;
        }
        try {
            console.log(`Calling mockSupplyChainUpdate with:`, { itemId, status });
            const result = await mockSupplyChainUpdate({ itemId, status });
            console.log("Cloud Function result:", result);
            if (result.data.success) {
                formMessage.textContent = `Success: ${result.data.message}`;
                formMessage.style.color = 'green';
                itemForm.reset();
            } else {
                formMessage.textContent = `Function reported issue: ${result.data.message || 'Unknown error'}`;
                formMessage.style.color = 'orange';
            }
        } catch (error) {
            console.error("Error calling Cloud Function:", error);
            formMessage.textContent = `Error: ${error.message || 'Failed to log item.'}`;
            formMessage.style.color = 'red';
        } finally {
             setTimeout(() => { if(formMessage) formMessage.textContent = ''; }, 5000);
        }
    });
} else {
  console.error("Item form not found.");
}

// Logout Button Listener
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        auth.signOut().then(() => {
            console.log('User signed out successfully via button.');
        }).catch((error) => {
            console.error('Sign out error:', error);
        });
    });
} else {
    console.error("Logout button not found.");
}

// Header Login/Logout Links (Optional - can be removed if only using FirebaseUI)
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Ensure auth container is visible if user clicks explicit login
        showAuthContainer();
    });
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        auth.signOut(); // Sign out if header link is clicked
    });
}


// --- Initial Auth State Check ---
// Explicitly check the initial state AFTER setting up listeners and functions
console.log("Performing explicit initial auth check.");
if (auth.currentUser) {
    console.log("Initial check: User found. Calling showAppContent.");
    showAppContent(auth.currentUser);
} else {
    console.log("Initial check: User not found. Calling showAuthContainer.");
    showAuthContainer();
}

// Optional: Export Firebase services if needed by other modules
export { auth, db, functions }; 