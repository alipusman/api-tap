import { functions, db } from "../../db";

export const onupdatetariksaldo = functions.firestore
    .document('tariksaldo/{idtariksaldo}')
    .onUpdate(async (change: any, context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const idtariksaldo = context.params.idtariksaldo
                const dataafter = change.after.data()
                const idcrew = dataafter.id_crew
                return db.collection('saldo_crews').doc(idcrew).collection('tariksaldo').doc(idtariksaldo).update(dataafter).then(() => {
                    return resolve()
                }).catch(() => {
                    return reject()
                })
            } catch (error) {
                return reject(error)
            }
        })
    })