import {Request, Response, NextFunction} from "express"
// import {admin}  from "../db"


export function isAuthorized(opts: { hasRole: Array<'administrator'|'admin'|'purchasing'|'manajemen'|'operasional' |'Admin'>, allowSameUser?: boolean }) {
   return (req: Request, res: Response, next: NextFunction) => {
    const { role } = res.locals

    //    const { role, uid } = res.locals
    //    const { id } = req.params

    //    if (opts.allowSameUser && id && uid ==== id)
    //        return next();
        
       if (!role){
           return res.status(403).send({message : 'Akses Ditolak (Authorization)'});
       }

       if (opts.hasRole.includes(role)){
           return next();
       }

       return res.status(403).send({message : 'Akses Ditolak (Authorization)'});
   }
}
export function isAuthorizedJabatan(opts: { hasRole: Array<'administrator'|'staff'|'leader'|'ast_manager'|'manager'|'gm'|'direksi'|'spv'|'koordinator'>, allowSameUser?: boolean }) {
    return (req: Request, res: Response, next: NextFunction) => {
     const { jabatan } = res.locals
 
        if (!jabatan){
            return res.status(403).send({message : 'Authorize'});
        }
 
        if (opts.hasRole.includes(jabatan)){
            return next();
        }
 
        return res.status(403).send({message : 'Authorize'});
    }
 }



