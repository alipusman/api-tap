import { Request, Response } from "express"
import { admin, db } from "../db"
import _ from "lodash"
import moment from "moment"
import axios from 'axios'


class setUser { //satu

    setPrivilege = async (req: Request, res: Response) => {
        try {

            const { uid, privilege, role, store } = req.body

            if (!uid || !privilege || !role || !store) {
                return res.status(400).send({ message: 'Not Complete', status: false });
            }

            await admin.auth().setCustomUserClaims(uid, {
                privilege: privilege,
                role: role,
                store: store,
                nik: ''
            })

            return res.status(200).send({ message: 'set privilege ${role} ${uid}', status: true })
        } catch (err) {
            return handleError(res, err)
        }
        function handleError(res: Response, err: any) {
            console.log(err)
            return res.status(500).send({ message: `${err.code} - ${err.message}`, status: false });
        }
    }

    getPrivilege = async (req: Request, res: Response) => { //dua
        try {
            const { uid } = req.body
            return await admin.auth().getUser(uid).then((userRecord: any) => {
                return res.status(200).send({ data: userRecord.customClaims['privilege'], status: true })
            })
        } catch (err) {
            return handleError(res, err)
        }

        function handleError(res: Response, err: any) {
            console.log({ err })
            return res.status(500).send({ message: 'Internal server error', status: false });
        }
    }

    createUser = async (req: Request, res: Response) => {
        console.log('di createuse')
        try {
            const { displayName, password, email, roleReq, store } = req.body
            if (!password || !email || !roleReq || !displayName) {
                return res.status(400).send({ message: 'Missing fields', status: false })
            }

            const { uid } = await admin.auth().createUser({
                displayName,
                password,
                email
            })
            if (store == '' || store == null) {
                await admin.auth().setCustomUserClaims(uid, {
                    role: roleReq.split(' ').join(''),
                })
            } else {
                await admin.auth().setCustomUserClaims(uid, {
                    role: roleReq.split(' ').join(''),
                    store: store.split(' ').join(''),

                })
            }


            await db.collection('users').doc(uid).set({
                email: email,
                role: roleReq.split(' ').join(''),
                displayName: displayName,
                store: store.split(' ').join(''),
                created_at: moment().unix(),
                created_by: res.locals.email
            })

            return res.status(200).send({ message: 'Berhasil update', status: true });
        } catch (err) {
            return handleError(res, err)
        }

        function handleError(res: Response, err: any) {
            console.log(err)
            return res.status(500).send({ message: 'Internal server error', status: false });
        }
    }

    deleteUser = async (req: Request, res: Response) => {
        try {
            const { uid } = req.body;
            const { email } = res.locals;
            const uniqDate = moment().unix();
            const userRef = db.collection('users').doc(uid)
            const getUser = await userRef.get();
            if (getUser.exists) {
                const data: any = getUser.data();
                data['deleteBy'] = email;
                data['deleteAt'] = uniqDate;
                await admin.auth().deleteUser(uid);
                await db.collection('users').doc(uid).delete();
                await db.collection('delete_user').add(data) //untuk history driver yang sudah di delete;
                return res.status(200).send({ message: 'ok', status: true })
            }
            return res.status(400).send({ message: 'User not found', status: false })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: 'Internal server error', status: false })
        }
    }
    updateCrew = async (req: Request, res: Response) => {

        try {
            console.log(123)
            const { email } = res.locals;
            console.log(124)
            const {
                crewNik,
                crewName,
                crewPosition,
                crewEmail,
                noSim,
                sim_exp,
                tanggalMasuk,
                areaToko,
                alamat,
                telfon,
                no_rekening,
                namaSaudara,
                alamatSaudara,
                hubSaudara,
                telfonSaudara,

            } = req.body;
            if (
                !crewNik ||
                !crewName ||
                !crewPosition ||
                !crewEmail ||
                !tanggalMasuk ||
                !areaToko ||
                !alamat ||
                !telfon ||
                !no_rekening ||
                !namaSaudara ||
                !alamatSaudara ||
                !hubSaudara ||
                !telfonSaudara
            ) {
                await db.collection('not_complete_api').add({
                    'createdAt': moment().unix(),
                    crewNik,
                    crewName,
                    crewPosition,
                    crewEmail,
                    tanggalMasuk,
                    areaToko,
                    alamat,
                    telfon,
                    namaSaudara,
                    alamatSaudara,
                    hubSaudara,
                    telfonSaudara, status
                })
                return res.status(400).send({ message: 'Not Complete' })
            }
            console.log(176)
            const crewRef = db.collection('m_crew').doc(crewNik)
            const datacrew = await crewRef.get()
            const uid = datacrew.data()!.uid
            console.log(181)
            await admin.auth().setCustomUserClaims(uid, {
                posisiCrew: crewPosition,
                role: 'crew',
                store: areaToko,
                nik: crewNik
            }).catch((error) => {
                console.log(188)
                console.log(JSON.stringify(error))
                throw error
            })
            console.log(191)
            await crewRef.update({
                posisiCrew: crewPosition,
                namaCrew : crewName,
                noSim: noSim,
                sim_exp: sim_exp,
                sim_expUnix: sim_exp == '' ? 0 : moment(sim_exp).unix(),
                tanggalMasuk: tanggalMasuk,
                tanggalMasukUnix: moment(tanggalMasuk).unix(),
                areaToko: areaToko,
                alamat: alamat,
                telfon: telfon,
                no_rekening: no_rekening,
                namaSaudara: namaSaudara,
                alamatSaudara: alamatSaudara,
                hubSaudara: hubSaudara,
                telfonSaudara: telfonSaudara,
                updatedBy: email,
            }).catch((error) => {
                console.log(212)
                console.log(JSON.stringify(error))
                throw error
            })
            console.log(215)
            return res.status(200).send({ message: 'Berhasil di tambah' })

        } catch (error) {
            console.log(JSON.stringify(error))
            return res.status(400).send({ message: 'gagal' })

        }

    }
    createCrew = async (req: Request, res: Response) => {
        try {
            const {
                crewNik,
                crewName,
                crewPosition,
                crewEmail,
                noSim,
                sim_exp,
                tanggalMasuk,
                areaToko,
                alamat,
                telfon,
                no_rekening,
                namaSaudara,
                alamatSaudara,
                hubSaudara,
                telfonSaudara,


            } = req.body;

            if (
                !crewNik ||
                !crewName ||
                !crewPosition ||
                !crewEmail ||
                !tanggalMasuk ||
                !areaToko ||
                !alamat ||
                !telfon ||
                !no_rekening ||
                !namaSaudara ||
                !alamatSaudara ||
                !hubSaudara ||
                !telfonSaudara
            ) {
                await db.collection('not_complete_api').add({
                    'createdAt': moment().unix(),
                    crewNik,
                    crewName,
                    crewPosition,
                    crewEmail,
                    tanggalMasuk,
                    areaToko,
                    alamat,
                    telfon,
                    namaSaudara,
                    alamatSaudara,
                    hubSaudara,
                    telfonSaudara
                })
                return res.status(400).send({ message: 'Not Complete' })
            }

            const { email } = res.locals;
            const nikCrew2 = crewNik.split(' ').join('').toUpperCase();
            const crewRef = db.collection('m_crew').doc(nikCrew2)
            const namaCrew2 = crewName.toUpperCase();
            const noSim2 = noSim.split(' ').join('');
            const tanggalMasukUnix = moment(tanggalMasuk).unix()
            const alamat2 = alamat.toUpperCase()
            const telfon2 = telfon
            const namaSaudara2 = namaSaudara.toUpperCase()
            const alamatSaudara2 = alamatSaudara.toUpperCase()
            const hubSaudara2 = hubSaudara.toUpperCase()
            const telfonSaudara2 = telfonSaudara
            const email2 = crewEmail.split(' ').join('')
            const crewRef1 = await crewRef.get()
            if (crewRef1.exists) {
                return res.status(400).send({ message: 'Already crew' })
            }


            const uid: any = await admin.auth().createUser({
                displayName: namaCrew2,
                password: 'qwertyuploader',
                email: email2
            }).then((result) => {
                return result.uid;
            }).catch((error) => {
                console.log({ error })
                return null;
            })

            if (uid == null) {
                return res.status(400).send({ message: 'Already Email' })
            }

            await admin.auth().setCustomUserClaims(uid, {
                posisiCrew: crewPosition,
                role: 'crew',
                store: areaToko,
                nik: nikCrew2
            })
            await crewRef.set({
                email: email2,
                nikCrew: nikCrew2,
                posisiCrew: crewPosition,
                noSim: noSim2,
                sim_exp: sim_exp,
                sim_expUnix: sim_exp == '' ? 0 : moment(sim_exp).unix(),
                tanggalMasuk: tanggalMasuk,
                tanggalMasukUnix: tanggalMasukUnix,
                areaToko: areaToko,
                alamat: alamat2,
                telfon: telfon2,
                no_rekening: no_rekening,
                namaSaudara: namaSaudara2,
                alamatSaudara: alamatSaudara2,
                hubSaudara: hubSaudara2,
                namaCrew: namaCrew2,
                telfonSaudara: telfonSaudara2,
                status: true,
                createdAt: moment().unix(),
                createdBy: email,
                uid: uid
            })

            await db.collection('store').doc(areaToko).collection('m_crew').doc(nikCrew2).set({
                email: email2,
                nikCrew: nikCrew2,
                posisiCrew: crewPosition,
                noSim: noSim2,
                sim_exp: sim_exp,
                sim_expUnix: sim_exp == '' ? 0 : moment(sim_exp).unix(),
                tanggalMasuk: tanggalMasuk,
                tanggalMasukUnix: tanggalMasukUnix,
                areaToko: areaToko,
                alamat: alamat2,
                telfon: telfon2,
                no_rekening: no_rekening,
                namaSaudara: namaSaudara2,
                alamatSaudara: alamatSaudara2,
                hubSaudara: hubSaudara2,
                namaCrew: namaCrew2,
                telfonSaudara: telfonSaudara2,
                status: true,
                createdAt: moment().unix(),
                createdBy: email,
                uid: uid
            })

            await db.collection('users').doc(uid).set({
                email: email2,
                role: 'crew',
                displayName: namaCrew2,
                store: areaToko,
                nik: nikCrew2
            })

            return res.status(200).send({ message: 'Berhasil di tambah' })
        } catch (error) {
            console.log({ error: error })
            return res.status(500).send({ message: 'Internal server error' })
        }
    }

    deleteCrew = async (req: Request, res: Response) => {
        try {
            const { crewNik } = req.body;
            const { email } = res.locals;
            const uniqDate = moment().unix();
            const driverRef = db.collection('m_crew').doc(crewNik)
            const getCrew = await driverRef.get();
            if (getCrew.exists) {
                const data: any = getCrew.data();
                data['deleteBy'] = email;
                data['deleteAt'] = uniqDate;
                const getUser = await db.collection('users').where('nik', '==', crewNik).limit(1).get();
                let uid = '';
                getUser.forEach((d2) => {
                    uid = d2.id;
                })
                await admin.auth().deleteUser(uid);
                await db.collection('users').doc(uid).delete();
                await db.collection('store').doc(data.areaToko).collection('m_crew').doc(crewNik).delete();
                await driverRef.delete();
                await db.collection('delete_crew').add(data) //untuk history driver yang sudah di delete;
                return res.status(200).send({ message: 'ok', status: true })
            }
            return res.status(400).send({ message: 'User not found', status: false })
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: 'Internal server error', status: false })
        }
    }

    updateclaims = async (req: Request, res: Response) => {

        try {
            const { uid, toko, role, name, nik } = req.body
            if (!uid || !toko || !role) {
                return res.status(400).send({ message: 'Missing fields' })
            }


            const privilege = await admin.auth().getUser(uid).then((userRecord: any) => {
                return userRecord.customClaims['privilege']
            })

            await admin.auth().setCustomUserClaims(uid, {
                role: role,
                store: toko,
                privilege: privilege,
                name: name,
                nik: nik
            })

            // await db.collection('users').doc(uid).update({
            //     displayName : name
            // })

            return res.status(200).send({ uid });
        } catch (err) {
            return handleError(res, err)
        }

        function handleError(res: Response, err: any) {
            return res.status(500).send({ message: `${err.code} - ${err.message}` });
        }
    }

    getToken = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const key = 'AIzaSyBH-Wzel0Tws8IpeuERTHjc9uDQQwYNv_Q';
            const refreshtoken: any = await axios({
                method: 'post',
                url: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + key,
                data: {
                    email,
                    password,
                    returnSecureToken: true
                }
            })
            if (refreshtoken === null) {
                return res.status(400).send({ message: 'Token Null', status: false })
            }
            const token = refreshtoken.data.idToken
            return res.status(200).send({ message: 'ok', status: true, data: token })
        } catch (error) {
            console.log(error)
            return res.status(400).send({ message: 'Token Null', status: false })
        }
    }

    pindahStore = async (req: Request, res: Response) => {
        try {
            const { listkru, storetujuan } = req.body;
            if (!listkru || !storetujuan) {
                return res.status(400).send({ message: 'Mohon lengkapi data' });
            }
            if (listkru.length <= 0) {
                return res.status(400).send({ message: 'Mohon lengkapi data' });
            }
            if (listkru.length > 10) {
                return res.status(400).send({ message: 'Maksimal 10 kru dalam 1 proses' });
            }
            const cek_kru_non_aktif = _.filter(listkru, { 'status': false });
            if (_.size(cek_kru_non_aktif) > 0) {
                return res.status(409).send({ message: 'Kru non-aktif tidak diizinkan ganti store' });
            }

            const cekstore = await db.collection('store').doc(storetujuan).get();

            if (!cekstore.exists) {
                return res.status(409).send({ message: 'Store yang anda masukkan tidak ditemukan' });
            }

            let privilege: Array<string> = []
            await db.collection('privilege').doc('crew').get().then((doc: any) => {
                if (doc.exists) {
                    const ii = doc.data().data
                    for (const y of ii) {
                        privilege.push(y.id)
                    }
                    return
                } else {
                    return
                }
            })

            for await (const i of listkru) {
                let uid = i['uid'];
                if (!uid) {
                    await db.collection('users').where('email', '==', i['email']).limit(1).get().then((doc: any) => {
                        if (doc.empty) {
                            res.status(409).send({ message: 'UID crew tersebut tidak ditemukan' });
                        } else {
                            doc.forEach((doc2: any) => {
                                return uid = doc2.id
                            })
                        }
                    })
                }
                const oldtoko = i['areaToko'];
                const nik = i['nikCrew'];
                const newdata = i;
                newdata['areaToko'] = storetujuan;
                await admin.auth().setCustomUserClaims(uid, {
                    role: 'crew',
                    store: storetujuan,
                    privilege: privilege,
                    nik: nik
                })
                await db.collection('m_crew').doc(nik).update({
                    'areaToko': storetujuan
                })
                await db.collection('store').doc(oldtoko).collection('m_crew').doc(nik).delete();
                await db.collection('store').doc(storetujuan).collection('m_crew').doc(nik).set(newdata);
            }
            return res.send({ message: 'ok' })
        } catch (error) {
            console.log(error)
            return res.status(400).send({ message: 'Token Null', status: false })
        }
    }
}
export default new setUser