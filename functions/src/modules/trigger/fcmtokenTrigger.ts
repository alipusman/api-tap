import {functions, messaging } from "../../db"

export const oncreatefcmtoken = functions.firestore.onDocumentCreated('tokenfcm/{idfcm}', (context) => {
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

export const ondeletfcmtoken = functions.firestore.onDocumentDeleted('tokenfcm/{idfcm}', (context) => {
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


export const onupdatefcmToken = functions.firestore.onDocumentUpdated('tokenfcm/{idfcm}', (context) => {
    return new Promise<void>( (resolve, reject) => {
        try {
            const snap = context.data
            // const dataabefore = snap?.before.data()
            const dataafter = snap?.after.data()
            const tokenafter = dataafter!.token
            const topicafter = dataafter!.topic
            // const tokenbefore = dataabefore!.token
            // const topicbefore = dataabefore!.token
            const registrationTokensafter = [
                tokenafter
            ];
    


            return  messaging.subscribeToTopic(registrationTokensafter, topicafter)
                .then(async(response) => {

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