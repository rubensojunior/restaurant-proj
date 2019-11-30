import * as restify from 'restify'
import {environment} from '../common/environment'
import {Router} from '../common/router'
import * as mongoose from 'mongoose'
import {handleError} from './error.handler'
import {mergePatchBodyParser} from './merge-patch.parser'
import { tokenParser } from '../security/token.parser'
import * as fs from 'fs'
import * as corsMiddleware from 'restify-cors-middleware'

export class Server {
    application: restify.Server

    initializeDb() {
        (<any>mongoose).Promise = global.Promise
        return mongoose.connect(environment.db.url, {
            //useMongoClient: true
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useFindAndModify: false
            useCreateIndex: true
        })
    }

    initRoutes(routers: Router[]): Promise<any>{
        return new Promise((resolve,reject)=>{
            try{
                this.application = restify.createServer({
                    name: 'restaurant-api',
                    version: '1.0.0',
                    //certificate: fs.readFileSync('./security/keys/cert.pem'),
                    //key: fs.readFileSync('./security/keys/key.pem')
                })

                const corsOptions: corsMiddleware.Options = {
                    preflightMaxAge: 10,
                    origins: ['http://localhost:8080'],
                    allowHeaders: ['authorization'],
                    exposeHeaders: ['x-custom-header']
                }

                const cors: corsMiddleware.CorsMiddleware = corsMiddleware(corsOptions)

                this.application.pre(cors.preflight)
                
                this.application.use(cors.actual)
                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePatchBodyParser)
                this.application.use(tokenParser)

                //rotas
                for(let router of routers){
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, ()=>{
                    resolve(this.application)
                })

                this.application.on('restifyError', handleError)
            }catch(error){
                reject(error)
            }
        })
    }

    bootstrap(routers: Router[] = []): Promise<Server>{
        return this.initializeDb().then(()=>
            this.initRoutes(routers).then(()=> this))
    }
}