import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
const { CloudTasksClient } = require("@google-cloud/tasks");
const vision = require('@google-cloud/vision');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://asg-ops-default-rtdb.asia-southeast1.firebasedatabase.app"

});

const clientv = new vision.ImageAnnotatorClient();

const db = admin.firestore()
const dbrealtime = admin.database();
const valuefield = admin.firestore.FieldValue
// test backup
export {
  // urlweb,
    CloudTasksClient,
    db,
    dbrealtime,
    clientv,
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