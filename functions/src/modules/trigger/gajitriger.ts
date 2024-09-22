import { db, functions } from "../../db"

export const ondeleteAbsen = functions.firestore
    .document('absensi/{idabsen}')
    .onCreate(async (snap: any, context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const idabsen = context.params.idabsen
                const data = snap.data()
                const iduser =  data.iduser
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