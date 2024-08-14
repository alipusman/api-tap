import express, {Application} from "express"
import * as db_1 from "../db"
import { isAuthenticated } from "../middleware/authMiddleware";
import { isAuthorized } from "../middleware/authorizationMiddleware";
import cors from "cors"
import compression from "compression"
import setUserController from  "../controller/setUserController"

//Proses CRUD User dan CREW
class SetUser {

    public app : Application;
    constructor(){
        this.app = express();
        this.plugins();
        this.routes();

    }
    protected plugins() : void {
        const options:cors.CorsOptions = {
            allowedHeaders: ["Origin","X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization", "apikey"],
            credentials: false,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            origin: "*",
            preflightContinue: false
          };
        this.app.use(compression())
        this.app.use(cors(options))
    }
    
    protected routes() : void {
        this.app.post('/users',
            isAuthenticated,
            isAuthorized({ hasRole: ['administrator'] }),
            setUserController.createUser
        );
        this.app.post('/users/createpegawai',
        isAuthenticated,
        isAuthorized({ hasRole: ['administrator', 'Admin'] }),
        setUserController.createPegawai
    );
        this.app.post('/update/users',
            isAuthenticated,
            isAuthorized({ hasRole: ['administrator'] }),
            setUserController.updateuser
        );

        this.app.post('/delete/users',
            isAuthenticated,
            isAuthorized({ hasRole: ['administrator'] }),
            setUserController.deleteUser
        );

        this.app.post('/users/privilege',
            isAuthenticated,
            isAuthorized({ hasRole: ['administrator'] }),
            setUserController.setPrivilege
        );

        this.app.post('/users/privilege/get',
            isAuthenticated,
            isAuthorized({ hasRole: ['administrator','admin'] }),
            setUserController.getPrivilege
        );


    };
            


}

const app = new SetUser().app


export const setUserModule = db_1.functions.region('us-central1').https.onRequest(app);