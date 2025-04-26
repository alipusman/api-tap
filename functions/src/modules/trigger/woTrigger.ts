import _ from "lodash"
import { db, functions } from "../../db"

export const ondeleteWO = functions.firestore.onDocumentDeleted
    ('workorder_produksi/{idwo}', (context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const idwo = context.params.idwo
                const snap = context.data
                const data = snap?.data()
                const id_gudang = data?.id_gudang
                const id_component_list = data?.id_component_list
                const id_datacomponent = data?.id_datacomponent

                const componentRef = db.collection('component_list').doc(id_component_list).collection('workorder_produksi').doc(idwo)
                const componenttabulasiRef = db.collection('component_list').doc(id_component_list).collection('tabulasi_component_list').doc(id_datacomponent).collection('workorder_produksi').doc(idwo)
                const gudangRef = db.collection('m_gudang').doc(id_gudang).collection('workorder_produksi').doc(idwo)
                const gudangcomponentRef = db.collection('m_gudang').doc(id_gudang).collection('component_list').doc(id_component_list).collection('workorder_produksi').doc(idwo)

                const batch = db.batch()

                batch.delete(componentRef)
                batch.delete(componenttabulasiRef)
                batch.delete(gudangRef)
                batch.delete(gudangcomponentRef)

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