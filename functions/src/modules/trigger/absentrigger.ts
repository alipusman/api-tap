import _ from "lodash"
import { db, functions } from "../../db"

export const ondeleteAbsen = functions.firestore.onDocumentDeleted
    ('absensi/{idabsen}', (context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const idabsen = context.params.idabsen
                const snap = context.data
                const data = snap?.data()
                const iduser = data!.iduser
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

export const ondeleteabsenpulangdalamjamkerja = functions.firestore.onDocumentDeleted
    ('users/{iduser}/absenpulangdalamjamkerja/{idabsen}',
        (context) => {
            return new Promise<void>(async (resolve, reject) => {
                try {
                    const idabsen = context.params.idabsen
                    const snap = context.data
                    const data = snap?.data()
                    // const iduser = data.iduser
                    const newdata = _.assign({ type: 'absenpulangdalamjamkerja' }, data)
                    const absenuserRef = db.collection('ijinabsen').doc(idabsen)
                    const batch = db.batch()
                    batch.set(absenuserRef, newdata)
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
export const ondeleteabsensi_pulang_luararea = functions.firestore.onDocumentDeleted('users/{iduser}/absenpulangdalamjamkerja/{idabsen}'
    , (context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const idabsen = context.params.idabsen
                const snap = context.data
                const data = snap?.data()
                // const iduser = data.iduser
                const newdata = _.assign({ type: 'absensi_pulang_luararea' }, data)
                const absenuserRef = db.collection('ijinabsen').doc(idabsen)
                const batch = db.batch()
                batch.set(absenuserRef, newdata)
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

export const ondeleteabsensi_luararea = functions.firestore.onDocumentDeleted('users/{iduser}/absenpulangdalamjamkerja/{idabsen}'
    , (context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const idabsen = context.params.idabsen
                const snap = context.data
                const data = snap?.data()
                // const iduser = data.iduser
                const newdata = _.assign({ type: 'absensi_luararea' }, data)
                const absenuserRef = db.collection('ijinabsen').doc(idabsen)
                const batch = db.batch()
                batch.set(absenuserRef, newdata)
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



export const ondeleteabsensimasukdalamjamkerja = functions.firestore.onDocumentDeleted
    ('users/{iduser}/absensimasukdalamjamkerja/{idabsen}', (context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const idabsen = _.toString(context.params.idabsen)
                const snap = context.data
                const data = snap?.data()
                // const iduser = data.iduser
                const newdata = _.assign({ type: 'absensimasukdalamjamkerja' }, data)
                const absenuserRef = db.collection('ijinabsen').doc(idabsen)
                const batch = db.batch()
                batch.set(absenuserRef, newdata)
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

export const oncreateabsen = functions.firestore.onDocumentCreated('absensi/{idabsen}'
    , (context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const idabsen = context.params.idabsen
                const snap = context.data
                const data = snap?.data()

                const iduser = data!.iduser
                const role = data!.role
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
                } else {
                    console.log('sudah ada role nya')
                    return resolve()
                }


            } catch (error) {
                console.log('Error deleting document: ', error)

                return reject(error)

            }

        })

    })


export const onupdateabsen = functions.firestore.onDocumentUpdated('absensi/{idabsen}'
    , (context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const snap = context.data
                const idabsen = context.params.idabsen
                const dataafter = snap?.after.data()
                const iduser = dataafter!.iduser
                const absenuserRef = db.collection('users').doc(iduser).collection('absensi').doc(idabsen)
                await absenuserRef.update(dataafter!)
                console.log(idabsen)
                resolve()
            } catch (error) {
                console.log('Error deleting document: ', error)

                return reject(error)

            }

        })

    })