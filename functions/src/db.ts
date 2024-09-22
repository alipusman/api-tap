import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
const { CloudTasksClient } = require("@google-cloud/tasks");

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: "https://tap-erp-94e6c-default-rtdb.firebaseio.com"

// });
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://live-tap-default-rtdb.asia-southeast1.firebasedatabase.app"

});


const db = admin.firestore()
const dbrealtime = admin.database();
const valuefield = admin.firestore.FieldValue
// test backup
export {
  // urlweb,
    CloudTasksClient,
    db,
    dbrealtime,
    // parentque,
    // url_taskhandler, 
    // url_taskhandlerrdo, 
    functions,
    // moment,
    admin,
    valuefield,
    // pubsub,
    // keyMessage,
    // urlMessage
}