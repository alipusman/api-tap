import moment from "moment";
import { db, functions } from "../../db";
import _ from "lodash";

export const logupdatecptdriver = functions.firestore.onDocumentUpdated
('cp_driver/{id_cpt}',
    (context) => {
        const snap = context.data
        const cpt = context.params.id_cpt
        let updatedBy = snap?.after.data().update_by
        if(_.isUndefined(updatedBy)){
            // console.log(cpt)
            updatedBy = 'updated'
        }
        const logRef = db.collection('cp_driver').doc(_.toString(cpt)).collection('log')

        function difference(object :any , base : any) {
            function changes(object : any, base : any) {
                return _.transform(object, function (result : any, value, key) {
                    if (!_.isEqual(value, base[key])) {
                        result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
                    }
                });
            }
            return changes(object, base);
        }
        const dataawal = snap!.before.data()
        const dataubah = snap!.after.data()
        let datarubahan = difference(dataubah, dataawal)
        let dataawalan = difference(dataawal, dataubah)
        return logRef.add({
            created_at: moment().unix(),
            dataawal: dataawalan,
            perubahan: datarubahan,
            keterangan: "update cpt",
            updated_by : updatedBy
        })
    });