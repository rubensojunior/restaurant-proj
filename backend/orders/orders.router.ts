import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {Order} from './orders.model'
import {NotFoundError} from 'restify-errors'
import {authorize} from '../security/authz.handler'

class OrdersRouter extends ModelRouter<Order> {
    constructor() {
        super(Order)
    }

    findItems = (req,resp,next) => {
        Order.findById(req.params.id).then(rest=>{
            if(!rest){
                throw new NotFoundError('Pedido não encontrado')
            } else {
                resp.json(rest.items)
                return next()
            }
        }).catch(next)
    }

    replaceMenu = (req, resp, next) => {
        Order.findById(req.params.id).then(rest=>{
            if(!rest){
                throw new NotFoundError('Pedido não encontrado')
            } else {
                rest.items = req.body
                return rest.save()
            }
        }).then(rest=>{
            resp.json(rest.items)
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
            Order.findByOwner(req.query.owner)
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

    findByOwnerAndRestaurant = (req, resp, next)=>{
        if(req.query.owner && req.query.restaurant){
            Order.findByOwnerAndRestaurant(req.query.owner, req.query.restaurant)
                .then(order => {
                    if(order){
                        return order
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
        application.get('/orders', [this.findByOwnerAndRestaurant,this.findByOwner,this.findAll])

        application.get('/orders/:id', [this.validateId,this.findById])

        application.post('/orders', [authorize('admin','owner'),this.save])

        application.put('/orders/:id', [authorize('admin','owner'),this.validateId,
                                                this.replace])

        application.patch('/orders/:id', [authorize('admin'),this.validateId,
                                                this.update])

        application.del('/orders/:id', [authorize('owner','admin'),this.validateId,
                                                this.delete])

        application.get('/orders/:id/menu', [this.validateId,this.findItems])

        application.put('/orders/:id/menu', [authorize('admin'),this.validateId, 
                                                this.replaceMenu])
    }
}

export const ordersRouter = new OrdersRouter()