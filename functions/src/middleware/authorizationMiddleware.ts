import {Request, Response, NextFunction} from "express"
// import {admin}  from "../db"


export function isAuthorized(opts: { hasRole: Array<'superadmin'|'administrator'|'crew'|'admin'|'korlap'|'korwil'|'manajemen'|'tl'>, allowSameUser?: boolean }) {
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



