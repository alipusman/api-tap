import { functions, messaging } from "../../db"


export const oncreatepreordertoken = functions.firestore.onDocumentCreated('preorder_sales/{id_preorder}/tokenfcm/{idfcm}', (context) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const snap = context.data
            const data = snap?.data()
            const token = data!.token
            const topic = data!.topic
            const registrationTokens = [
                token
            ];
            return messaging.subscribeToTopic(registrationTokens, topic)
                .then((response) => {
                    // See the MessagingTopicManagementResponse reference documentation
                    // for the contents of response.
                    console.log('Successfully subscribed to topic:', response);
                    return resolve()
                })
                .catch((error) => {
                    console.log('Error subscribing to topic:', error);
                    return reject()

                });
        } catch (error) {
            console.log('Error registration topic: ', error)

            return reject(error)

        }

    })

})

export const ondeletpreorderfcmtoken = functions.firestore.onDocumentDeleted('preorder_sales/{id_preorder}/tokenfcm/{idfcm}', (context) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const snap = context.data
            const data = snap?.data()
            const token = data!.token
            const topic = data!.topic
            const registrationTokens = [
                token
            ];
            return messaging.unsubscribeFromTopic(registrationTokens, topic)
                .then((response) => {
                    // See the MessagingTopicManagementResponse reference documentation
                    // for the contents of response.
                    console.log('Successfully unsubscribed to topic:', response);
                    return resolve()
                })
                .catch((error) => {
                    console.log('Error unsubscribing to topic:', error);
                    return reject()

                });
        } catch (error) {
            console.log('Error registration topic: ', error)

            return reject(error)

        }

    })

})