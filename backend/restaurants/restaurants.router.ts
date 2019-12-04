import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {Restaurant} from './restaurants.model'
import {NotFoundError} from 'restify-errors'
import {authorize} from '../security/authz.handler'

class RestaurantsRouter extends ModelRouter<Restaurant> {
    constructor() {
        super(Restaurant)
    }

    findMenu = (req,resp,next) => {
        Restaurant.findById(req.params.id, "+menu").then(rest=>{
            if(!rest){
                throw new NotFoundError('Restaurant not found')
            } else {
                resp.json(rest.menu)
                return next()
            }
        }).catch(next)
    }

    replaceMenu = (req, resp, next) => {
        Restaurant.findById(req.params.id).then(rest=>{
            if(!rest){
                throw new NotFoundError('Restaurant not found')
            } else {
                rest.menu = req.body
                return rest.save()
            }
        }).then(rest=>{
            resp.json(rest.menu)
            return next()
        }).catch(next)
    }

    findById = (req, resp, next)=>{
        this.model.findById(req.params.id)
            .populate('owner','name')
            .then(this.render(resp,next))
            .catch(next)
    }

    findByOwner = (req, resp, next)=>{
        if(req.query.owner){
            Restaurant.findByOwner(req.query.owner)
                .then(restaurant => {
                    if(restaurant){
                        return restaurant
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

    findByOwnerAndName = (req, resp, next)=>{
        if(req.query.owner && req.query.name){
            Restaurant.findByOwnerAndName(req.query.owner, req.query.name)
                .then(restaurant => {
                    if(restaurant){
                        return restaurant
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
        application.get('/restaurants', [this.findByOwnerAndName,this.findByOwner,this.findAll])

        application.get('/restaurants/:id', [this.validateId,this.findById])

        application.post('/restaurants', [authorize('admin','owner'),this.save])

        application.put('/restaurants/:id', [authorize('admin','owner'),this.validateId,
                                                this.replace])

        application.patch('/restaurants/:id', [authorize('admin'),this.validateId,
                                                this.update])

        application.del('/restaurants/:id', [authorize('owner','admin'),this.validateId,
                                                this.delete])

        application.get('/restaurants/:id/menu', [this.validateId,this.findMenu])

        application.put('/restaurants/:id/menu', [authorize('admin'),this.validateId, 
                                                this.replaceMenu])
    }
}

export const restaurantsRouter = new RestaurantsRouter()