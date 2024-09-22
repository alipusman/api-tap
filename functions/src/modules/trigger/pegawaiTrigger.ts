
import { db, functions } from "../../db"
import { getAuth } from "firebase-admin/auth"

export const ondeletepegawai = functions.firestore
    .document('m_pegawai/{idpegawai}')
    .onDelete(async (snap: any, context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const auth = getAuth()
                const data = snap.data()
                const iduser = data.uid
                const absenuserRef = db.collection('users').doc(iduser)

                const batch = db.batch()

                batch.delete(absenuserRef)

                return await batch.commit().then(async () => {
                    await auth.deleteUser(iduser)
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