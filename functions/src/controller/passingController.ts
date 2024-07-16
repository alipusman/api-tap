import { Request, Response } from "express"
import { db } from "../db"
import _ from "lodash"
import moment from "moment"


class passingC { //satu

    passingToko = async (req: Request, res: Response) => {
        try {

            const { alamatToko, kodeAreaToko, lat , lng, namaAreaToko, singkatan, status, price} = req.body
            console.log(alamatToko, kodeAreaToko, lat , lng, namaAreaToko, singkatan, status, price)
            const newstore = {
                alamatToko,
                createdAt: moment().unix(),
                createdBy: 'sistem ',
                kodeAreaToko: kodeAreaToko,
                latlng: {
                    lat: _.toNumber(lat),
                    lng: _.toNumber(lng),
                },
                namaAreaToko: namaAreaToko,
                singkatan: singkatan,
                status : status
            }
            const setprice = {data : price || ''}
            const storeref = db.collection('store').doc(kodeAreaToko)
            const priceref = storeref.collection('priceQuery').doc('vehicle')
            const batch = db.batch()
            batch.set(storeref, newstore)
            batch.set(priceref, setprice)
           return batch.commit().then(()=>{
            return res.status(200).send({ message: `berhasil`, status: false });

            }).catch((err)=>{
               return handleError(res, err)
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
export default new passingC