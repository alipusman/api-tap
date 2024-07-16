import { db, functions } from "../../db"

export const ondeletecpdriver = functions.firestore
    .document('cp_driver/{idcp}')
    .onDelete(async (snap: any, context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const data = snap.data()
                const id_driver = data.id_driver
                const idcp = context.params.idcp
                const idstore = data.idstore
                console.log(id_driver, idcp, idstore)
                const cpcrew = db.collection('m_crew').doc(id_driver).collection('cp_driver').doc(idcp)
                const cpstorecrew = db.collection('store').doc(idstore).collection('m_crew').doc(id_driver).collection('cp_driver').doc(idcp)
                const cpstore = db.collection('store').doc(idstore).collection('cp_driver').doc(idcp)

                const batch = db.batch()
                batch.delete(cpcrew)
                batch.delete(cpstorecrew)
                batch.delete(cpstore)

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