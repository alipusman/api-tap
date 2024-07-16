import express, {Application} from "express"
import * as db_1 from "../db"
import { isAuthenticated } from "../middleware/authMiddleware";
import { isAuthorized } from "../middleware/authorizationMiddleware";
import cors from "cors"
import compression from "compression"
import helmet from "helmet"
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
        this.app.use(helmet())
        this.app.use(cors(options))
    }
    
    protected routes() : void {
        this.app.post('/users',
            isAuthenticated,
            isAuthorized({ hasRole: ['superadmin','administrator'] }),
            setUserController.createUser
        );

        this.app.post('/delete/users',
            isAuthenticated,
            isAuthorized({ hasRole: ['superadmin','administrator'] }),
            setUserController.deleteUser
        );

        this.app.post('/users/privilege',
            isAuthenticated,
            isAuthorized({ hasRole: ['superadmin','administrator'] }),
            setUserController.setPrivilege
        );

        this.app.post('/users/privilege/get',
            isAuthenticated,
            isAuthorized({ hasRole: ['superadmin','administrator','admin'] }),
            setUserController.getPrivilege
        );

        this.app.post('/users/create/crew',
            isAuthenticated,
            isAuthorized({ hasRole: ['superadmin','administrator', 'admin', 'korlap', 'korwil'] }),
            setUserController.createCrew
        );
        this.app.post('/users/update/crew',
        isAuthenticated,
        isAuthorized({ hasRole: ['superadmin','administrator', 'admin', 'korlap', 'korwil'] }),
        setUserController.updateCrew
    );
        
        this.app.post('/users/delete/crew',
            isAuthenticated,
            isAuthorized({ hasRole: ['superadmin','administrator', 'admin', 'korlap', 'korwil'] }),
            setUserController.deleteCrew
        );
        
        this.app.post('/users/updateclaim',
            isAuthenticated,
            isAuthorized({ hasRole: ['superadmin','administrator'] }),
            setUserController.updateclaims
        );

        this.app.post('/getToken',
            setUserController.getToken
        );

        this.app.post('/pindah/store',
            isAuthenticated,
            isAuthorized({ hasRole: ['superadmin','administrator'] }),
            setUserController.pindahStore
        );

    };
            


}

const app = new SetUser().app


export const setUserModule = db_1.functions.region('us-central1').https.onRequest(app);