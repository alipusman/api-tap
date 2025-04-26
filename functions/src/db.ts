import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
const { CloudTasksClient } = require("@google-cloud/tasks");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // databaseURL: "https://tap-erp-94e6c-default-rtdb.firebaseio.com"
  databaseURL : "https://tap-web-9836e-default-rtdb.firebaseio.com"
});
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: "https://live-tap-default-rtdb.asia-southeast1.firebasedatabase.app"

// });
const url_taskhandler = "https://us-central1-tap-erp-94e6c.cloudfunctions.net/"
const messaging = admin.messaging()
const db = admin.firestore()
const dbrealtime = admin.database();
const valuefield = admin.firestore.FieldValue
// test backup
export {
  url_taskhandler,
  // urlweb,
    CloudTasksClient,
    db,
    dbrealtime,
    messaging,
    functions,
    admin,
    valuefield,

}