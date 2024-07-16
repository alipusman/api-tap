import {Request, Response, NextFunction} from "express"
import {admin}  from "../db"
import _ from 'lodash'

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    
    // const apikey : any = req.headers.apikey
    const authorization = req.headers.authorization
    // res.set('Cache-Control', 'public, max-age=1, s-maxage=1')ß

   if (!authorization){
       return res.status(401).send({ message: 'Unauthorized'});
   }

   if (!authorization.startsWith('Bearer')){
       return res.status(401).send({ message: 'Unauthorized'});
   }

   const split = authorization.split('Bearer ')
   if (split.length !== 2){
       return res.status(401).send({ message: 'Unauthorized'});
   }

   const token = split[1]

   try {
       const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
            res.locals = { ...res.locals, 
            uid: decodedToken.uid, 
            role: decodedToken.role, 
            email: decodedToken.email,
            store: decodedToken.store,
            name: decodedToken.name,
            nik: decodedToken.nik
        }

       
       return next();
   }
   catch (err) {
       console.error(err)
       return res.status(401).send({ message: 'Unauthorized', line : "33 auth"});
   }
}






