import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {Pedido} from './pedidos.model'
import {NotFoundError} from 'restify-errors'
import {authorize} from '../security/authz.handler'

class PedidosRouter extends ModelRouter<Pedido> {
    constructor() {
        super(Pedido)
    }

    findItens = (req,resp,next) => {
        Pedido.findById(req.params.id).then(rest=>{
            if(!rest){
                throw new NotFoundError('Pedido não encontrado')
            } else {
                resp.json(rest.itens)
                return next()
            }
        }).catch(next)
    }

    replaceMenu = (req, resp, next) => {
        Pedido.findById(req.params.id).then(rest=>{
            if(!rest){
                throw new NotFoundError('Pedido não encontrado')
            } else {
                rest.itens = req.body
                return rest.save()
            }
        }).then(rest=>{
            resp.json(rest.itens)
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
            Pedido.findByOwner(req.query.owner)
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
        application.get('/pedidos', [this.findByOwner,this.findAll])

        application.get('/pedidos/:id', [this.validateId,this.findById])

        application.post('/pedidos', [authorize('admin','owner'),this.save])

        application.put('/pedidos/:id', [authorize('admin','owner'),this.validateId,
                                                this.replace])

        application.patch('/pedidos/:id', [authorize('admin'),this.validateId,
                                                this.update])

        application.del('/pedidos/:id', [authorize('owner','admin'),this.validateId,
                                                this.delete])

        application.get('/pedidos/:id/menu', [this.validateId,this.findItens])

        application.put('/pedidos/:id/menu', [authorize('admin'),this.validateId, 
                                                this.replaceMenu])
    }
}

export const pedidosRouter = new PedidosRouter()