import {ModelRouter} from '../common/model-router'
import * as restify from 'restify'
import {Category} from './categories.model'
import {NotFoundError} from 'restify-errors'
import {authorize} from '../security/authz.handler'

class CategoriesRouter extends ModelRouter<Category> {
    constructor() {
        super(Category)
    }

    findById = (req, resp, next)=>{
        this.model.findById(req.params.id)
            .populate('owner','name')
            .then(this.render(resp,next))
            .catch(next)
    }

    findByOwner = (req, resp, next)=>{
        if(req.query.owner){
            Category.findByOwner(req.query.owner)
                .then(category => {
                    if(category){
                        return category
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
            Category.findByOwnerAndRestaurant(req.query.owner, req.query.restaurant)
                .then(category => {
                    if(category){
                        return category
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
        application.get('/categories', [this.findByOwnerAndRestaurant,this.findByOwner,this.findAll])

        application.get('/categories/:id', [this.validateId,this.findById])

        application.post('/categories', [authorize('admin','owner'),this.save])

        application.put('/categories/:id', [authorize('admin','owner'),this.validateId,
                                                this.replace])

        application.patch('/categories/:id', [authorize('admin','owner'),this.validateId,
                                                this.update])

        application.del('/categories/:id', [authorize('owner','admin'),this.validateId,
                                                this.delete])
    }
}

export const categoriesRouter = new CategoriesRouter()