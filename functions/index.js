const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Admin SDK ONLY ONCE
try {
  admin.initializeApp();
} catch (e) {
  console.log("Admin SDK already initialized or error:", e);
  // If already initialized, it might throw an error, which we can often ignore in dev/emulator.
}

const db = admin.firestore();

exports.mockSupplyChainUpdate = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check (Crucial)
  if (!context.auth) {
     throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to log items.');
  }

  // 2. Input Validation (Backend) - Minimal but important
  const itemId = data.itemId ? String(data.itemId).trim() : null;
  const status = data.status ? String(data.status).trim() : null;

  if (!itemId || itemId.length === 0 || !status || status.length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'Item ID and Status cannot be empty.');
  }
  // Add more specific validation if needed (e.g., length limits)

  // 3. Logging (Essential for DevOps points)
  functions.logger.info("Received item update request:", {
      userId: context.auth.uid,
      itemId: itemId, // Use validated/trimmed data
      status: status, // Use validated/trimmed data
      raw_data: data // Log raw input for debugging if needed
  });

  // 4. Mock Blockchain Interaction (The core "fake" part)
  functions.logger.info(`MOCK BLOCKCHAIN: Simulating sending update for item ${itemId} with status ${status} to a smart contract.`);
  // In a real DApp, you'd use ethers.js or web3.js here to interact with your deployed contract.
  // const tx = await contract.updateItem(itemId, status);
  // await tx.wait();
  // functions.logger.info(`Mock Blockchain TX Hash: 0xFakeTxHash${Date.now()}`); // Simulate getting a Tx hash

  // 5. Save to Firestore (The actual data storage)
  try {
    const writeResult = await db.collection("items").add({
      itemId: itemId, // Save validated data
      status: status, // Save validated data
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userId: context.auth.uid, // Link item to the logged-in user
      // blockchainTxMock: `0xFakeTxHash${Date.now()}` // Optionally save the fake hash
    });
    functions.logger.info("Item saved to Firestore with ID:", writeResult.id);
    // 6. Return Success Response
    return { success: true, message: `Item ${itemId} logged successfully (Blockchain interaction mocked).`, docId: writeResult.id };
  } catch (error) {
    functions.logger.error("Error saving item to Firestore:", error);
    // 7. Return Error Response
    throw new functions.https.HttpsError('internal', 'Failed to save item data to Firestore.', error.message);
  }
});

// Optional: Add a simple callable function to get items (or use Firestore directly on client)
// exports.getItems = functions.https.onCall(async (data, context) => {
//    if (!context.auth) { throw new functions.https.HttpsError('unauthenticated', 'Must be logged in.'); }
//    try {
//        const snapshot = await db.collection('items').where('userId', '==', context.auth.uid).orderBy('timestamp', 'desc').limit(20).get();
//        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//        return { success: true, items: items };
//    } catch (error) {
//        functions.logger.error("Error getting items:", error);
//        throw new functions.https.HttpsError('internal', 'Failed to get items.');
//    }
// }); 