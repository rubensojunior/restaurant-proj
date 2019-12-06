"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const categories_model_1 = require("./categories.model");
const authz_handler_1 = require("../security/authz.handler");
class CategoriesRouter extends model_router_1.ModelRouter {
    constructor() {
        super(categories_model_1.Category);
        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id)
                .populate('owner', 'name')
                .then(this.render(resp, next))
                .catch(next);
        };
        this.findByOwner = (req, resp, next) => {
            if (req.query.owner) {
                categories_model_1.Category.findByOwner(req.query.owner)
                    .then(category => {
                    if (category) {
                        return category;
                    }
                    else {
                        return [];
                    }
                })
                    .then(this.renderAll(resp, next))
                    .catch(next);
            }
            else {
                next();
            }
        };
        this.findByOwnerAndRestaurant = (req, resp, next) => {
            if (req.query.owner && req.query.restaurant) {
                categories_model_1.Category.findByOwnerAndRestaurant(req.query.owner, req.query.restaurant)
                    .then(category => {
                    if (category) {
                        return category;
                    }
                    else {
                        return [];
                    }
                })
                    .then(this.renderAll(resp, next))
                    .catch(next);
            }
            else {
                next();
            }
        };
    }
    applyRoutes(application) {
        application.get('/categories', [this.findByOwnerAndRestaurant, this.findByOwner, this.findAll]);
        application.get('/categories/:id', [this.validateId, this.findById]);
        application.post('/categories', [authz_handler_1.authorize('admin', 'owner'), this.save]);
        application.put('/categories/:id', [authz_handler_1.authorize('admin', 'owner'), this.validateId,
            this.replace]);
        application.patch('/categories/:id', [authz_handler_1.authorize('admin', 'owner'), this.validateId,
            this.update]);
        application.del('/categories/:id', [authz_handler_1.authorize('owner', 'admin'), this.validateId,
            this.delete]);
    }
}
exports.categoriesRouter = new CategoriesRouter();
