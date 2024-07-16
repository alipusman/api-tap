import moment from "moment"
import { db, functions } from "../../db"
import _ from "lodash"

export const onsaldocrew = functions.firestore
    .document('cp_driver/{idcp}')
    .onUpdate(async (change: any, context) => {
        return new Promise<void>((resolve, reject) => {
            try {
                const idcp = context.params.idcp
                const dataafter = change.after.data()
                const databefore = change.before.data()
                // const statusaldoaf = dataafter.statussaldo
                const statussaldoBF = databefore.statussaldo
                if (statussaldoBF) {
                    console.log('sudah set saldo before')
                    return resolve()
                }

                if (!dataafter.statusdriver) {
                    console.log('driver belom selesai')
                    return resolve()
                }
                if (!dataafter.statusupdatekm) {
                    console.log('korlap blom selesai')
                    return resolve()
                }

                const id_driver = dataafter.id_driver
                const id_helper = dataafter.id_helper
                const cpdriverRef = db.collection('cp_driver').doc(idcp)
                const saldodriverRef = db.collection('saldo_crews').doc(id_driver)
                const saldohelperRef = db.collection('saldo_crews').doc(id_helper)


                return db.runTransaction(async (transaction) => {
                    return transaction.getAll(cpdriverRef, saldodriverRef, saldohelperRef).then(async (doc: any) => {

                        const idtransaksi = Math.random().toString(36).substr(2, 6);
                        const transaksidriverRef = saldodriverRef.collection('transaksi').doc('driver-' + idtransaksi)
                        const transactionhelperRef = saldohelperRef.collection('transaksi').doc('helper-' + idtransaksi)
                        const transactionPotDriverRef = saldodriverRef.collection('transaksi_hutang').doc('driverpot-' + idtransaksi)
                        const transactionPotHelperRef = saldohelperRef.collection('transaksi_hutang').doc('helperpot-' + idtransaksi)
                        const datacpdriver = doc[0].data()
                        if (datacpdriver.statussaldo) {
                            return resolve()
                        }
                        const datacrewdriver = await db.collection('m_crew').doc(id_driver).get().then((doc: any) => {
                            let statussaldo = doc.data().statussaldo || null

                            return statussaldo
                        })
                        const datacrewdhelper = await db.collection('m_crew').doc(id_helper).get().then((doc: any) => {
                            let statussaldohelper = doc.data().statussaldo || null

                            return statussaldohelper

                        })
                        if (datacrewdriver) {

                            if (!doc[1].exists) {
                                const dataset = {
                                    id_crew: dataafter.id_driver,
                                    nama_crew: dataafter.nama_driver,
                                    saldo: dataafter.total_estimasi.b_driver,
                                    saldo_hutang: 0,
                                    potongan: 0
                                }
                                const transaksi = {
                                    cpid: idcp,
                                    created_at: moment().unix(),
                                    created_date: moment().format('YYYY-MM-DD'),
                                    keterangan: "Premi Rit " + dataafter.ritase,
                                    saldo: dataafter.total_estimasi.b_driver,
                                    transaksi: dataafter.total_estimasi.b_driver,
                                    type: "Kredit"
                                }
                                transaction.update(cpdriverRef, { statussaldo: true })
                                transaction.set(saldodriverRef, dataset)
                                transaction.set(transaksidriverRef, transaksi)
                            } else {
                                const datasaldo = doc[1].data()
                                const saldo_hutang = datasaldo.saldo_hutang
                                let penambahansaldo = dataafter.total_estimasi.b_driver
                                let potongan = 0
                                let newsaldohutang = 0
                                if (saldo_hutang > 0) {
                                    potongan = datasaldo.potongan
                                    if (saldo_hutang > potongan) {
                                        penambahansaldo = penambahansaldo - potongan
                                    } else {
                                        potongan = potongan - saldo_hutang
                                        penambahansaldo = penambahansaldo - potongan
                                    }
                                    newsaldohutang = saldo_hutang - potongan
                                }
                                const newsaldo = datasaldo.saldo + penambahansaldo
                                const dataset = {
                                    saldo: newsaldo,
                                    saldo_hutang: newsaldohutang
                                }
                                const transaksi = {
                                    cpid: idcp,
                                    created_at: moment().unix(),
                                    created_date: moment().format('YYYY-MM-DD'),
                                    keterangan: "Premi Rit " + dataafter.ritase,
                                    saldo: newsaldo,
                                    transaksi: penambahansaldo,
                                    type: "Kredit"
                                }
                                if (saldo_hutang > 0) {
                                    const potransaksihutang = {
                                        cpid: idcp,
                                        created_at: moment().unix(),
                                        created_date: moment().format('YYYY-MM-DD'),
                                        keterangan: "Potongan Premi Rit " + dataafter.ritase,
                                        saldo: newsaldohutang,
                                        transaksi: potongan,
                                        type: "Debit"
                                    }
                                    transaction.set(transactionPotDriverRef, potransaksihutang)
                                }

                                transaction.update(cpdriverRef, { statussaldo: true })
                                transaction.update(saldodriverRef, dataset)
                                transaction.set(transaksidriverRef, transaksi)
                            }
                        }
                        if (datacrewdhelper) {


                            if (!doc[2].exists) {
                                const dataset = {
                                    id_crew: dataafter.id_helper,
                                    nama_crew: dataafter.nama_helper,
                                    saldo: dataafter.total_estimasi.b_helper,
                                    saldo_hutang: 0,
                                    potongan: 0
                                }
                                const transaksi = {
                                    cpid: idcp,
                                    created_at: moment().unix(),
                                    created_date: moment().format('YYYY-MM-DD'),
                                    keterangan: "Premi Rit " + dataafter.ritase,
                                    saldo: dataafter.total_estimasi.b_helper,
                                    transaksi: dataafter.total_estimasi.b_helper,
                                    type: "Kredit"
                                }
                                transaction.set(saldohelperRef, dataset)
                                transaction.set(transactionhelperRef, transaksi)
                            } else {
                                const datasaldohelper = doc[2].data()
                                const saldo_hutanghelper = datasaldohelper.saldo_hutang
                                let penambahansaldohelper = dataafter.total_estimasi.b_helper
                                let potonganhelper = 0
                                let newsaldohutanghelper = 0
                                if (saldo_hutanghelper > 0) {
                                    potonganhelper = datasaldohelper.potongan
                                    if (saldo_hutanghelper > potonganhelper) {
                                        penambahansaldohelper = penambahansaldohelper - potonganhelper
                                    } else {
                                        potonganhelper = potonganhelper - saldo_hutanghelper
                                        penambahansaldohelper = penambahansaldohelper - potonganhelper
                                    }
                                    newsaldohutanghelper = saldo_hutanghelper - potonganhelper
                                }
                                const newsaldohelper = datasaldohelper.saldo + penambahansaldohelper
                                const datasethelper = {
                                    saldo: newsaldohelper,
                                    saldo_hutang: newsaldohutanghelper
                                }
                                const transaksihelper = {
                                    cpid: idcp,
                                    created_at: moment().unix(),
                                    created_date: moment().format('YYYY-MM-DD'),
                                    keterangan: "Premi Rit " + dataafter.ritase,
                                    saldo: newsaldohelper,
                                    transaksi: penambahansaldohelper,
                                    type: "Kredit"
                                }
                                if (saldo_hutanghelper > 0) {
                                    const potransaksihutang = {
                                        cpid: idcp,
                                        created_at: moment().unix(),
                                        created_date: moment().format('YYYY-MM-DD'),
                                        keterangan: "Potongan Premi Rit " + dataafter.ritase,
                                        saldo: newsaldohutanghelper,
                                        transaksi: potonganhelper,
                                        type: "Debit"
                                    }
                                    transaction.set(transactionPotHelperRef, potransaksihutang)
                                }
                                transaction.update(saldohelperRef, datasethelper)
                                transaction.set(transactionhelperRef, transaksihelper)
                            }
                        }
                    }).then(async () => {
                        return resolve()
                    }).catch(error => {
                        throw 'error transaction';

                    })
                }).then(async () => {


                    return resolve()
                }).catch(error => {
                    console.log(error)
                    return reject(error)
                })


            } catch (error) {
                console.log(error)
                return reject(error)
            }
        })

    })