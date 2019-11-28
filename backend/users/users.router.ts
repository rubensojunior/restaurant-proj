import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {User} from './users.model'
import {NotFoundError} from 'restify-errors'
import {authenticate} from '../security/auth.handler'
import {authorize} from '../security/authz.handler'

class UsersRouter extends ModelRouter<User> {

    constructor(){
        super(User)
        this.on('beforeRender', document=>{
            document.password = undefined
        })
    }

    findByEmail = (req, resp, next)=>{
        if(req.query.email){
            User.findByEmail(req.query.email)
                .then(user => {
                    if(user){
                        return [user]
                    }else{
                        return []
                    }
                })
                .then(this.renderAll(resp, next))
                .catch(next)
        }else{
            next()
        }
    }

    applyRoutes(application: restify.Server){
        application.get('/users', [authorize('admin'), this.findByEmail, 
                                    this.findAll])

        application.get('/users/:id', [authorize('admin'), this.validateId,
                                    this.findById])

        application.post('/users', [authorize('admin'),this.save])

        application.put('/users/:id', [authorize('admin'),this.validateId,
                                    this.replace])
                                    
        application.del('/users/:id', [authorize('admin'),this.validateId,
                                    this.delete])

        application.post('/users/authenticate', authenticate)
    }
}

export const usersRouter = new UsersRouter()