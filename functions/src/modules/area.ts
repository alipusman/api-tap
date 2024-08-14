import express, { Application } from "express"
import * as db_1 from "../db"
import { isAuthenticated } from "../middleware/authMiddleware";
import { isAuthorizedJabatan } from "../middleware/authorizationMiddleware";
import cors from "cors"
import compression from "compression"
import _ from 'lodash'
import { Request, Response } from "firebase-functions";

function getDistance(latorigin: number, latdestination: number, longorigin: number, longdestination: number) {
    return new Promise<number>( (resolve) => {
        try {
            if ((latorigin == latdestination) && (longorigin == longdestination)) {
                return 0;
            } else {
                const pi = Math.PI;
                const sin = Math.sin;
                const cos = Math.cos;
                const acos = Math.acos;
                const radlat1 = pi * latorigin / 180;
                const radlat2 = pi * latdestination / 180;
                const theta = longorigin - longdestination;
                const radtheta = pi * theta / 180;
                let dist: number = sin(radlat1) * sin(radlat2) +
                    cos(radlat1) * cos(radlat2) * cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = acos(dist);
                dist = dist * 180 / pi;
                dist = dist * 60 * 1.1515;
                const result = _.round(dist, 2);
                return resolve(result);
            }
        } catch (e) {
            return 0.0;
        }
    })
}

// function sendNotif(registrationToken: string, title: string, content: string, data: { route: string, byname: string, date: string }) {
//     return new Promise<string>(async (resolve) => {
//         try {
//             const message = {
//                 to: registrationToken,
//                 data: {
//                     "title": title,
//                     "content": content,
//                     "route": data.route,
//                     "byname": data.byname,
//                     "date": data.date
//                 },
//                 notification: {
//                     title: title,
//                     body: content
//                 },
//                 "direct_boot_ok": true
//             }

//             return await axios({
//                 method: 'post',
//                 url: db_1.urlMessage,
//                 headers: { 'Authorization': 'key=' + db_1.keyMessage, 'Content-Type': 'application/json' },
//                 data: JSON.stringify(message)
//             }).then(() => {
//                 return resolve('ok');
//             }).catch((error) => {
//                 return resolve(error.toString());
//             })

//         } catch (e) {
//             return resolve('');
//         }
//     })
// }

class setUserClass {

    public app: Application;
    constructor() {
        this.app = express();
        this.plugins();
        this.routes();
    }

    protected plugins(): void {
        const options: cors.CorsOptions = {
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization", "apikey"],
            credentials: false,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            origin: "*",
            preflightContinue: false
        };
        this.app.use(compression())
        this.app.use(cors(options))
    }

    protected routes(): void {
    

        this.app.get('/location/new',
            isAuthenticated,
            isAuthorizedJabatan({ hasRole: ['administrator', 'staff', 'leader', 'ast_manager', 'manager', 'gm', 'direksi', 'spv', 'koordinator'] }),
            async function (req: Request, res: Response) {
                try {
                    const { uid, divisi, jabatan } = res.locals;
                    const { long, lat } = req.query;
                    if (!long || !lat) {
                        return res.status(400).send({ message: 'Lokasi tidak ditemukan' });
                    }
                    const longorigin: number = +long;
                    const latorigin: number = +lat;
                    const data: Array<any> = [];

                    const getLokasi: any = await db_1.db.collection('lokasi_uid').doc(uid).get();

                    if (!getLokasi.exists) {
                        const getData = await db_1.db.collection('lokasi').get()
                        if (getData.size == 0) {
                            return res.send(200).send({ message: 'ok', data: [] })
                        }

                        getData.forEach((d2) => {
                            const d = d2.data();
                            data.push({
                                'nama': d.nama,
                                'alamat': d.alamat,
                                'area': d.area || '',
                                'berlakusemua': d.berlakusemua || 'Semua', 
                                'batasan_absen': d.prioritas || '',
                                'googleAlamat': d.googleAlamat || d.alamat,
                                'id': d2.id,
                                'longlat': d.longlat,
                                'perdivisi': d.lockDivisi || [],
                                'perjabatan': d.lockJabatan || [],
                                'perorangan': d.lockPegawai || [],
                                'place_id': d.place_id || null,
                                'radius': d.radius || 50
                            })
                        })

                        const promise = await Promise.all(data);
                        const filtersemua = _.filter(promise, function (o) { return o.berlakusemua == 'Semua'});
                        const filterdivisi = _.filter(promise, function (o) { return o.batasan_absen == 'divisi' && _.includes(o.perdivisi, divisi) });
                        const filterperorangan = _.filter(promise, function (o) { return o.batasan_absen == 'pegawai' && _.includes(o.perorangan, uid) });
                        const filterjabatan = _.filter(promise, function (o) { return o.batasan_absen == 'jabatan' && _.includes(o.perjabatan, jabatan) });
                        const filterjabatandandivisi = _.filter(promise, function (o) { return o.batasan_absen == 'divisidanjabatan' && _.includes(o.perjabatan, jabatan) && _.includes(o.perdivisi, divisi) });
                        const result = _.uniqBy([...filtersemua, ...filterdivisi, ...filterperorangan,...filterjabatan,...filterjabatandandivisi], 'id');
                        await db_1.db.collection('lokasi_uid').doc(uid).set({
                            data: result
                        })
                        const resultfix = [];
                        for await (const i of result) {
                            const longlatdata = i.longlat
                            const long = longlatdata['long'];
                            const lat = longlatdata['lat'];
                            const distance = await getDistance(latorigin, lat, longorigin, long);
                            if (Number(distance) <= 1) {
                                resultfix.push(i)
                            }
                        }
                        return res.status(200).send({ message: 'ok', data: resultfix, size: _.size(resultfix), divisi, uid })
                    }
                    const promise = getLokasi.data().data;
                    const resultfix = [];
                    for await (const i of promise) {
                        const longlatdata = i.longlat
                        const long = longlatdata['long'];
                        const lat = longlatdata['lat'];
                        const distance = await getDistance(latorigin, lat, longorigin, long);
                        if (Number(distance) <= 1) {
                            resultfix.push(i)
                        }
                    }
                    return res.status(200).send({ message: 'ok', data: resultfix, size: _.size(resultfix), divisi })

                } catch (error) {
                    console.log(error);
                    const err: any = error;
                    return res.status(500).send({ message: err.message })
                }
            }
        );

  
        this.app.get('/schedule',
            isAuthenticated,
            isAuthorizedJabatan({ hasRole: ['administrator', 'staff', 'leader', 'ast_manager', 'manager', 'gm', 'direksi', 'spv', 'koordinator'] }),
            async function (req: Request, res: Response) {
                try {
                    const { uid, divisi, jabatan } = res.locals;
                    const data: Array<any> = [];

                    const getjammasuk: any = await db_1.db.collection('jam_kerja').get();
                    getjammasuk.forEach((d2: any) => {
                        const obj = d2.data();
                        const hari_libur = [];
                        const hariLiburdata = obj.hari_libur;
                        if (_.includes(hariLiburdata, 7)) {
                            hari_libur.push('Jadwal libur tidak ditentukan')
                        } else {
                            for (const t of _.sortBy(hariLiburdata)) {
                                switch (t) {
                                    case 0:
                                        hari_libur.push('Minggu')
                                        break;
                                    case 1:
                                        hari_libur.push('Senin')
                                        break;
                                    case 2:
                                        hari_libur.push('Selasa')
                                        break;
                                    case 3:
                                        hari_libur.push('Rabu')
                                        break;
                                    case 4:
                                        hari_libur.push('Kamis')
                                        break;
                                    case 5:
                                        hari_libur.push('Jumat')
                                        break;
                                    default:
                                        hari_libur.push('Sabtu')
                                        break;
                                }
                            }
                        }
                        data.push({
                            'dispansasi_terlambat': obj.dispansasi_terlambat,
                            'jam_masuk': obj.jam_masuk,
                            'jam_pulang': obj.jam_pulang,
                            'namaShift': obj.namaShift,
                            'hari_libur': hari_libur,
                            'prioritas' : obj.prioritas,
                            'lockDivisi' : obj.lockDivisi,
                            'lockPegawai' : obj.lockPegawai,
                            'lockJabatan' : obj.lockJabatan,
                            'berlakusemua' : obj.berlakusemua,
                            'id' : obj.id
                        });
                    })

                    const promise = await Promise.all(data);
                    const filtersemua = _.filter(promise, function (o) { return o.berlakusemua == 'Semua' });
                    const filterdivisi = _.filter(promise, function (o) { return o.prioritas == 'divisi' && _.includes(o.lockDivisi, divisi) });
                    const filterjabatan = _.filter(promise, function (o) { return o.prioritas == 'jabatan' && _.includes(o.lockJabatan, jabatan) });
                    const filterdivisidanjabatan = _.filter(promise, function (o) { return o.prioritas == 'divisidanjabatan' && _.includes(o.lockDivisi, divisi) && _.includes(o.lockJabatan, jabatan)});
                    const filterperorangan = _.filter(promise, function (o) { return o.prioritas == 'pegawai' && _.includes(o.lockPegawai, uid) });
                    const resultfilter = _.uniqBy([...filterperorangan, ...filterdivisi, ...filtersemua,...filterjabatan,...filterdivisidanjabatan], 'id');
                    return res.status(200).send({
                        message: 'ok',
                        data: resultfilter,
                        divisi
                    })

                } catch (error) {
                    console.log(error);
                    const err: any = error;
                    return res.status(500).send({ message: err.message })
                }
            }
        );

    

  

        

        this.app.get('/cekseesion',
            function (req: Request, res: Response){
                return res.redirect('/login')
            }
        )
    };
}

const app = new setUserClass().app


export const area = db_1.functions.region('us-central1').https.onRequest(app);