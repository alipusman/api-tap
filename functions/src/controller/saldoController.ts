import { Request, Response } from "express"
import {  db } from "../db"
import _ from "lodash"
import moment from "moment"


class setsaldo { //satu

    buattariksaldo = async (req: Request, res: Response) => {
        try {

            const { idcrew, nominal } = req.body

            if (!idcrew || !nominal) {
                return res.status(400).send({ message: 'Not Complete', status: false });
            }

            const crewRef = db.collection('m_crew').doc(idcrew)
            const crew = await crewRef.get()
            if (!crew.exists) {
                return res.status(404).send({ message: 'crew tidak ditemukan' })

            }
            const datacrew = crew.data()
            const idstore = datacrew!.areaToko
            const namaCrew = datacrew!.namaCrew
            const no_rekening = datacrew!.no_rekening
            const datalimit = await db.collection('limit_saldo').doc('limit').get().then(doc=>{
                return doc.data()
            })
            const potongan = datalimit!.potongan

            const idtariksaldo = Math.random().toString(36).substr(2, 6);
            const saldoRef = db.collection('saldo_crews').doc(idcrew)
            const transaksicrewRef = saldoRef.collection('transaksi').doc(idtariksaldo)
            const transaksicrewadmRef = saldoRef.collection('transaksi').doc('adm-'+idtariksaldo)
            const tariksaldocrewRef = saldoRef.collection('tariksaldo').doc(idtariksaldo)
            const tariksaldoRef = db.collection('tariksaldo').doc(idtariksaldo)
            const now = moment().unix()
            return db.runTransaction(async (transaction) => {
                return transaction.get(saldoRef).then((saldoDoc) => {
                    if (!saldoDoc.exists) {
                        return res.status(200).send({ message: 'saldo tidak exists', status: false })
                    }
                    const datasaldo = saldoDoc.data()
                    const saldoawal = datasaldo!.saldo
                    const newsaldo = saldoawal - nominal
                    const newsaldoadmin = newsaldo - potongan
                    if (newsaldo < 0) {
                        return res.status(200).send({ message: 'saldo tidak mencukupi' })
                    }
                    const detailtransaksi = {
                        keterangan : 'request tarik saldo',
                        cpid : idtariksaldo,
                        created_at : now,
                        created_date : moment().format('YYYY-MM-DD'),
                        saldo : newsaldo,
                        transaksi : nominal,
                        type : 'Debit'
                    }
                    const detailtransaksiadm = {
                        keterangan : 'request tarik saldo',
                        cpid : idtariksaldo,
                        created_at : now + 1,
                        created_date : moment().format('YYYY-MM-DD'),
                        saldo : newsaldoadmin,
                        transaksi : potongan,
                        type : 'Debit'
                    }
                    const dataset = {
                        id: idtariksaldo,
                        id_crew: idcrew,
                        created_unix: now,
                        nominal: nominal,
                        admin: 2000,
                        id_store: idstore,
                        saldo_awal: saldoawal,
                        status: 'dibuat',
                        no_rekening,
                        namaCrew
                    }
                    transaction.update(saldoRef, { saldo: newsaldoadmin })
                    transaction.set(tariksaldocrewRef, dataset)
                    transaction.set(tariksaldoRef, dataset)
                    transaction.set(transaksicrewRef, detailtransaksi)
                    transaction.set(transaksicrewadmRef, detailtransaksiadm)
                    return 'ok'
                })

            }).then((result) => res.status(200).send({ message: 'success', status: true}))

        } catch (err) {
            return handleError(res, err)
        }
        function handleError(res: Response, err: any) {
            console.log(err)
            return res.status(500).send({ message: `${err.code} - ${err.message}`, status: false });
        }
    }


}
export default new setsaldo