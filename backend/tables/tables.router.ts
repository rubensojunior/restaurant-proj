import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {Table} from './tables.model'
import {NotFoundError} from 'restify-errors'
import {authorize} from '../security/authz.handler'

class TablesRouter extends ModelRouter<Table> {
    constructor() {
        super(Table)
    }

    findById = (req, resp, next)=>{
        this.model.findById(req.params.id)
            .populate('owner','name')
            .then(this.render(resp,next))
            .catch(next)
    }

    findByOwner = (req, resp, next)=>{
        if(req.query.owner){
            Table.findByOwner(req.query.owner)
                .then(table => {
                    if(table){
                        return table
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

    findByOwnerAndRestaurant = (req, resp, next)=>{
        if(req.query.owner && req.query.restaurant){
            Table.findByOwnerAndRestaurant(req.query.owner, req.query.restaurant)
                .then(table => {
                    if(table){
                        return table
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
        application.get('/tables', [this.findByOwnerAndRestaurant,this.findByOwner,this.findAll])

        application.get('/tables/:id', [this.validateId,this.findById])

        application.post('/tables', [authorize('admin','owner'),this.save])

        application.put('/tables/:id', [authorize('admin','owner'),this.validateId,
                                                this.replace])

        application.patch('/tables/:id', [authorize('admin'),this.validateId,
                                                this.update])

        application.del('/tables/:id', [authorize('owner','admin'),this.validateId,
                                                this.delete])
    }
}

export const tablesRouter = new TablesRouter()