import { Request, Response } from "express"
import { db } from "../db"
// import _ from "lodash"
import moment from "moment"
import _ from "lodash"
// import axios from 'axios'


class setcoilController { //satu

    tambahcoil = async (req: Request, res: Response) => {
        try {

            const id_subcoil = req.body.id_subcoil
            const data = req.body.data
            const aktual_kg = data.aktual_kg
            const subcoilRef  =db.collection('m_subcoil').doc(id_subcoil)
            const now = moment().unix()
            const i = _.toUpper(Math.random().toString(36).substr(2, 6));
            return db.runTransaction(async (transaction) => {
                return transaction.get(subcoilRef).then((coilDoc) => {
                    if (!coilDoc.exists) {
                        return res.status(200).send({ message: 'saldo tidak exists', status: false })
                    }
                    const datacoil = coilDoc.data()
                    const stok = datacoil!.stok
                    const newstok = stok + aktual_kg
                    const datasetstoktransaksi = _.assign({transaksi : aktual_kg, saldo : newstok, createdAt :now}, data)

                    transaction.update(subcoilRef, {stok : newstok})
                   return transaction.set(subcoilRef.collection('transaksistok').doc(i),datasetstoktransaksi )
        

                }).then(()=>{
                    return res.status(200).send({ message: 'set privilege ${role} ${uid}', status: true })
                })
            })


        } catch (err) {
            return handleError(res, err)
        }
        function handleError(res: Response, err: any) {
            console.log(err)
            return res.status(500).send({ message: `${err.code} - ${err.message}`, status: false });
        }
    }

   
}
export default new setcoilController