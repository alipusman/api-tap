import { admin, functions } from "../../db"

export const ondeletecrew = functions.firestore
    .document('m_crew/{idcrew}')
    .onDelete(async (snap: any, context) => {
        return new Promise<void>((resolve, reject) => {
            const datauser = snap.data()
            const iduser = datauser.uid
            console.log(datauser.email)
             admin.auth().deleteUser(iduser).then(() => {
                return resolve()
            }).catch(() => {
                return reject
            })
            return resolve()
        })
    })