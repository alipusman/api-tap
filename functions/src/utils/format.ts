import { uniqBy } from 'lodash'
import moment from 'moment';
import { db } from '../db';
function adaduplikat(arr:Array<any>) {
    return new Promise<boolean>(async(resolve)=>{
        const cek = uniqBy(arr, 'noNP').length !== arr.length;
        if(cek == true){
            await db.collection('debug_error').add({
                'message' : 'Duplikat Data',
                'class' : 'adaduplikat',
                'createdAt' : moment().unix(),
                'row' : 458,
                'data' : {
                    arr
                }
            })
        }
        return resolve(cek);
    })
}

function adaduplikatTRTO(arr:Array<any>) {
    return new Promise<boolean>(async(resolve)=>{
        const cek = uniqBy(arr, 'noDN').length !== arr.length;
        if(cek == true){
            await db.collection('debug_error').add({
                'message' : 'Duplikat Data',
                'class' : 'adaduplikatTRTO',
                'createdAt' : moment().unix(),
                'row' : 458,
                'data' : {
                    arr
                }
            })
        }
        return resolve(cek);
    })
}

export {
    adaduplikat,
    adaduplikatTRTO
}