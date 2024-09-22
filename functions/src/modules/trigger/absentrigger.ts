import _ from "lodash"
import { db, functions } from "../../db"

export const ondeleteAbsen = functions.firestore
    .document('absensi/{idabsen}')
    .onDelete(async (snap: any, context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const idabsen = context.params.idabsen
                const data = snap.data()
                const iduser = data.iduser
                const absenuserRef = db.collection('users').doc(iduser).collection('absensi').doc(idabsen)
                const batch = db.batch()

                batch.delete(absenuserRef)

                return await batch.commit().then(() => {
                    console.log('Document successfully deleted!')
                    return resolve()

                }).catch((error) => {
                    console.log('Error deleting document: ', error)
                    return reject(error)
                })
            } catch (error) {
                console.log('Error deleting document: ', error)

                return reject(error)

            }

        })

    })

export const oncreateabsen = functions.firestore
    .document('absensi/{idabsen}')
    .onCreate(async (snap: any, context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const idabsen = context.params.idabsen
                const data = snap.data()
                const iduser = data.iduser
                const role = data.role
                if (_.isUndefined(role)) {
                    const absenuserRef = db.collection('users').doc(iduser).collection('absensi').doc(idabsen)
                    const absendepanRef = db.collection('absensi').doc(idabsen)
                    const roleuser = await db.collection('users').doc(iduser).get().then((doc) => {
                        return doc.data()!.role
                    })
                    const batch = db.batch()
                    batch.update(absenuserRef, { role: roleuser })
                    batch.update(absendepanRef, { role: roleuser })
                    return await batch.commit().then(() => {
                        console.log('update absen ' + idabsen)
                        return resolve()
                    }).catch((error) => {
                        console.log('Error deleting document: ', error)
                        return reject(error)
                    })
                }else{
                    console.log('sudah ada role nya')
                    return resolve()
                }


            } catch (error) {
                console.log('Error deleting document: ', error)

                return reject(error)

            }

        })

    })