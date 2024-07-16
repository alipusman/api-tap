import { db, functions, valuefield, } from "../../db"
import _ from "lodash"

export const oncreatecpDriverstats = functions.firestore
    .document('cp_driver/{idcp}')
    .onCreate(async (snap: any, context) => {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const data = snap.data()

                const dateberangkat = data.departure
                const splitdate = dateberangkat.split('-')
                const yearManifest = splitdate[0]
                const monthManifest = splitdate[1]
                const dateManifest = splitdate[2]

                const adjustmentIncrement = valuefield.increment(1)
                // const jmlhdn = valuefield.increment(data.rute.length)
                const statistikRef = db.collection('statistik')
                const yearmanifestRef = statistikRef.doc(yearManifest.toString())
                const monthManifestRef = yearmanifestRef.collection('bulan').doc(monthManifest.toString())
                const dateManifestRef = monthManifestRef.collection('tanggal').doc(dateManifest.toString())
                const yearmanifestRef_store = statistikRef.doc(yearManifest.toString()).collection('store').doc(data.idstore)
                const monthManifestRef_store = yearmanifestRef.collection('bulan').doc(monthManifest.toString()).collection('store').doc(data.idstore)
                const dateManifestRef_store = monthManifestRef.collection('tanggal').doc(dateManifest.toString()).collection('store').doc(data.idstore)

                const yearRefManifest: any = await yearmanifestRef.get()
                const monthRefManifest: any = await monthManifestRef.get()
                const dateRefManifest: any = await dateManifestRef.get()
                const yearRefManifest_store: any = await yearmanifestRef_store.get()
                const monthRefManifest_store: any = await monthManifestRef_store.get()
                const dateRefManifest_store: any = await dateManifestRef_store.get()

                const newdata = {
                    cost: 0,
                    real_cost: 0,
                    tr: 0,
                    to: 0,
                    cp: 0,
                    dn: 0,

                }
                if (!yearRefManifest.exists) {
                    await yearmanifestRef.set(newdata)
                }
                if (!monthRefManifest.exists) {
                    await monthManifestRef.set(newdata)
                }
                if (!dateRefManifest.exists) {
                    await dateManifestRef.set(newdata)
                }
                if (!yearRefManifest_store.exists) {
                    await yearmanifestRef_store.set(newdata)
                }
                if (!monthRefManifest_store.exists) {
                    await monthManifestRef_store.set(newdata)
                }
                if (!dateRefManifest_store.exists) {
                    await dateManifestRef_store.set(newdata)
                }
                let dataset = {
                    cp: adjustmentIncrement,
                }



                const batch = db.batch()

                batch.update(yearmanifestRef, dataset)
                batch.update(monthManifestRef, dataset)
                batch.update(dateManifestRef, dataset)

                batch.update(yearmanifestRef_store, dataset)
                batch.update(monthManifestRef_store, dataset)
                batch.update(dateManifestRef_store, dataset)


                return batch.commit().then(async () => {
                    return resolve()
                })

            } catch (error) {
                console.log('Error deleting document: ', error)
                return reject(error)
            }

        })

    })


export const onupdatepDriverstats = functions.firestore
    .document('cp_driver/{idcp}')
    .onUpdate(async (change: any, context) => {
        return new Promise<void>(async (resolve, reject) => {
            const data = change.after.data()
            const idcp = context.params.idcp
            if (!data.statusupdatekm) {
                console.log('ga nambah cost')
                return resolve()
            }
            const cpdriverRef = db.collection('cp_driver').doc(idcp)
            const type = data.type
            const dateberangkat = data.departure
            const splitdate = dateberangkat.split('-')
            const yearManifest = splitdate[0]
            const monthManifest = splitdate[1]
            const dateManifest = splitdate[2]
            const rute = data.rute
            const rutelength = rute.length
            console.log(rutelength, 'rute length')
            const statistikRef = db.collection('statistik')
            const yearmanifestRef = statistikRef.doc(yearManifest.toString())
            const monthManifestRef = yearmanifestRef.collection('bulan').doc(monthManifest.toString())
            const dateManifestRef = monthManifestRef.collection('tanggal').doc(dateManifest.toString())
            const yearmanifestRef_store = statistikRef.doc(yearManifest.toString()).collection('store').doc(data.idstore)
            const monthManifestRef_store = yearmanifestRef.collection('bulan').doc(monthManifest.toString()).collection('store').doc(data.idstore)
            const dateManifestRef_store = monthManifestRef.collection('tanggal').doc(dateManifest.toString()).collection('store').doc(data.idstore)
            return db.runTransaction(async (transaction) => {
                return transaction.getAll(cpdriverRef, yearmanifestRef, monthManifestRef, dateManifestRef, yearmanifestRef_store, monthManifestRef_store, dateManifestRef_store).then((datadoc) => {
                    const datacp = datadoc[0].data()
                    if (datacp!.statusstatscost && datacp!.statusstatrealcost) {
                        console.log('sudah ditambah di statistik')
                        return resolve()
                    }

                    let dataset = {}
                    if (type == "DN") {
                        dataset = {
                            dn: valuefield.increment(rutelength),
                            cost: valuefield.increment(data.total_estimasi.tarif)

                        }
                    } else if (type == "TR") {
                        dataset = {
                            tr: valuefield.increment(rutelength),
                            cost: valuefield.increment(data.total_estimasi.tarif)

                        }
                    } else {
                        dataset = {
                            to: valuefield.increment(rutelength),
                            cost: valuefield.increment(data.total_estimasi.tarif)

                        }
                    }
                    if (!datacp!.statusstatscost && datacp!.statusdriver) {


                        transaction.update(yearmanifestRef, dataset)
                        transaction.update(monthManifestRef, dataset)
                        transaction.update(dateManifestRef, dataset)

                        transaction.update(yearmanifestRef_store, dataset)
                        transaction.update(monthManifestRef_store, dataset)
                        transaction.update(dateManifestRef_store, dataset)
                        transaction.update(cpdriverRef, { statusstatscost: true })

                    } else if (datacp!.statuskalkulasi && datacp!.statusadmin && datacp!.statusupdatekm && datacp!.statusdriver) {
                        dataset = {
                            real_cost: valuefield.increment(data.total_estimasi.tarif)
                        }

                        transaction.update(yearmanifestRef, dataset)
                        transaction.update(monthManifestRef, dataset)
                        transaction.update(dateManifestRef, dataset)

                        transaction.update(yearmanifestRef_store, dataset)
                        transaction.update(monthManifestRef_store, dataset)
                        transaction.update(dateManifestRef_store, dataset)

                        transaction.update(cpdriverRef, { statusstatrealcost: true })

                    } else {
                        console.log('tidak ada update')

                        return resolve()


                    }
                })
            }).then(()=>{
                return resolve()
            }).catch((error)=>{
                return reject(error)
            })
        })
    })

