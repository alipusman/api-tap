import express, {Application} from "express"
import * as db_1 from "../db"
import { isAuthenticated } from "../middleware/authMiddleware";
import { isAuthorized } from "../middleware/authorizationMiddleware";
import cors from "cors"
import compression from "compression"
import saldoController from  "../controller/saldoController"

//Proses CRUD User dan CREW
class SaldoModule {

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
        this.app.post('/tariksaldo',
            isAuthenticated,
            isAuthorized({ hasRole: ['administrator'] }),
            saldoController.buattariksaldo
        );


    };
            


}

const app = new SaldoModule().app


export const saldomodule = db_1.functions.region('us-central1').https.onRequest(app);