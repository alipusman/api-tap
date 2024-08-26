import { Request, Response } from "express"
import { admin, db } from "../db"
// import _ from "lodash"
import moment from "moment"
// import axios from 'axios'


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
            const { displayName, password, email, roleReq } = req.body
            if (!password || !email || !roleReq || !displayName) {
                return res.status(400).send({ message: 'Missing fields', status: false })
            }

            const { uid } = await admin.auth().createUser({
                displayName,
                password,
                email
            })
            await admin.auth().setCustomUserClaims(uid, {
                role: roleReq.split(' ').join(''),
                displayName,
                email,
                uid
            })



            await db.collection('users').doc(uid).set({
                email: email,
                role: roleReq.split(' ').join(''),
                displayName: displayName,
                created_at: moment().unix(),
                created_by: res.locals.email,
                uid
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

    createPegawai = async (req: Request, res: Response) => {
        console.log('di createuse')
        try {
            const { displayName, email, roleReq, id_nik, jabatan, id_pic, no_telfon, type_gaji } = req.body
            if (!email || !roleReq || !displayName) {
                console.log(99)
                return res.status(400).send({ message: 'Missing fields', status: false })
            }

            const { uid } = await admin.auth().createUser({
                displayName,
                password : 'qwerty',
                email
            })
            await admin.auth().setCustomUserClaims(uid, {
                role: roleReq.split(' ').join(''),
                displayName,
                email,
                uid,
                type_gaji,
                nik : id_nik
            })

            const datanew = {
                no_telfon,
                email: email,
                role: roleReq.split(' ').join(''),
                nama : displayName,
                jabatan,
                id_pic,
                id_nik,
                divisi : roleReq.split(' ').join(''),
                displayName: displayName,
                created_at: moment().unix(),
                created_by: res.locals.email,
                type_gaji,
                uid
            }
            await db.collection('m_pegawai').doc(id_nik).set(datanew)
            await db.collection('users').doc(uid).set(datanew)

            return res.status(200).send({ message: 'Berhasil update', status: true });
        } catch (err) {
            return handleError(res, err)
        }

        function handleError(res: Response, err: any) {
            console.log(err)
            return res.status(500).send({ message: 'Internal server error', status: false });
        }
    }

    updateuser = async (req: Request, res: Response) => {
        console.log('di createuse')
        try {
            const { email, displayName, roleReq, uid } = req.body
            if (!email || !roleReq || !displayName) {
                return res.status(400).send({ message: 'Missing fields', status: false })
            }


            await admin.auth().setCustomUserClaims(uid, {
                role: roleReq.split(' ').join(''),
                displayName,
                email
            })



            await db.collection('users').doc(uid).update({
                email: email,
                role: roleReq.split(' ').join(''),
                displayName: displayName,
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

}
export default new setUser