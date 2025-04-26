

import { Timestamp } from "firebase-admin/firestore"
import { functions, messaging, db } from "../../db"



export const oncreatelogPesanpreorder = functions.firestore.onDocumentCreated('preorder_sales/{idorder}/logpesan/{idlog}', (context) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const snap = context.data
            const data = snap?.data()


            const message = [
                {
                    data: {
                        body: JSON.stringify({
                            title: data!.id_preorder,
                            from: data!.logpesan_by,
                            pesan: data!.log_pesan,
                            created_at: data!.logpesan_at
                        })

                    },
                    topic: 'ADMINISTRATOR_topic'
                },
                {
                    data: {
                        body: JSON.stringify({
                            title: data!.id_preorder,
                            from: data!.logpesan_by,
                            pesan: data!.log_pesan,
                            created_at: data!.logpesan_at
                        })

                    },
                    topic: data!.id_preorder
                },

            ]

            return messaging.sendEach(message).then((response) => {
                console.log(response)
                return resolve()
            }).catch((error) => {
                return reject()
            })
        } catch (error) {
            console.log('Error deleting document: ', error)
            return reject(error)
        }

    })

})


export const onupdatepreordernotif = functions.firestore.onDocumentUpdated('preorder_sales/{idorder}', (context) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const snap = context.data
            const data = snap?.after.data()
            const status = data!.status

            const body = {
                title: data!.id_preorder,
                from: data!.updated_by,
                pesan: status + ' ' + data!.id_preorder,
                created_at: data!.updated_at
            }
            const message = [
                {
                    data: {
                        body: JSON.stringify(body)

                    },
                    topic: 'ADMINISTRATOR_topic'
                },
                {
                    data: {
                        body: JSON.stringify(body)

                    },
                    topic: data!.id_preorder
                },

            ]

            return messaging.sendEach(message).then((response) => {
                console.log(response)
                return resolve()
            }).catch((error) => {
                return reject()
            })
        } catch (error) {
            console.log('Error deleting document: ', error)
            return reject(error)
        }

    })

})

export const onupdatepreorderassgindrafter = functions.firestore.onDocumentUpdated('preorder_sales/{idorder}', (context) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            const snap = context.data
            const databefore = snap?.before.data()
            const datafter = snap?.after.data()
            const assigndrafterbefore = databefore!.assign_drafter
            const assigndrafterafter = datafter!.assign_drafter
            const preorderRef = db.collection('preorder_sales').doc(datafter!.id_preorder)

            if (assigndrafterbefore == '-' && assigndrafterafter != '-') {
                const emaildrafter = assigndrafterafter
                const usersRef = db.collection('users')
                const getusers = await usersRef.where('email', '==', emaildrafter).get()
                let token = ''
                let iddevice = ''
                let iduser = ''
                getusers.forEach(docs => {
                    token = docs.data().token
                    iddevice = docs.data().iddevice
                    iduser = docs.data().uid
                })
                await preorderRef.collection('tokenfcm').doc(iduser + '_' + iddevice).set({
                    email: emaildrafter,
                    expiredAt: Timestamp.fromDate(new Date(Date.now() + 3600 * 1000 * 24)), // expired 24 jam
                    token,
                    topic: datafter!.id_preorder
                })
                console.log('assign drafter')
                return resolve()

            } else if (assigndrafterafter != assigndrafterbefore) {
                const emaildrafter = assigndrafterafter
                const usersRef = db.collection('users')
                const getusers = await usersRef.where('email', '==', emaildrafter).get()
                let token = ''
                let iddevice = ''
                let iduser = ''
                getusers.forEach(docs => {
                    token = docs.data().token
                    iddevice = docs.data().iddevice
                    iduser = docs.data().uid
                })
                await preorderRef.collection('tokenfcm').doc(iduser + '_' + iddevice).set({
                    email: emaildrafter,
                    expiredAt: Timestamp.fromDate(new Date(Date.now() + 3600 * 1000 * 24)), // expired 24 jam
                    token,
                    topic: datafter!.id_preorder
                })
                const emailolddrafter = assigndrafterbefore
                await preorderRef.collection('tokenfcm').where('email', '==', emailolddrafter).get().then((docs) => {
                    if (docs.size > 0) {
                        docs.forEach(async (doc) => {

                            await preorderRef.collection('tokenfcm').doc(doc.id).delete()
                        })
                    }
                })
                console.log('perubahan drafter')
                return resolve()
            } else {
                console.log('tidak ada update drafter')
                return resolve()
            }


        } catch (error) {
            console.log('Error deleting document: ', error)
            return reject(error)
        }

    })

})