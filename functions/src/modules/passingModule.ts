import express, {Application} from "express"
import * as db_1 from "../db"

import cors from "cors"
import compression from "compression"
import helmet from "helmet"
import passingC from  "../controller/passingController"

//Proses CRUD User dan CREW
class passingMod {

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
        this.app.post('/',
            passingC.passingToko
        );


    };
            


}

const app = new passingMod().app


export const passingModule = db_1.functions.region('us-central1').https.onRequest(app);