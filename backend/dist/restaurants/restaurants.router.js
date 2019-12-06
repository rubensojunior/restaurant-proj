"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const restaurants_model_1 = require("./restaurants.model");
const restify_errors_1 = require("restify-errors");
const authz_handler_1 = require("../security/authz.handler");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
        this.findMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id, "+menu").then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    resp.json(rest.menu.sort(function (a, b) {
                        if (a.category > b.category) {
                            return 1;
                        }
                        if (a.category < b.category) {
                            return -1;
                        }
                        return 0;
                    }));
                    return next();
                }
            }).catch(next);
        };
        this.replaceMenu = (req, resp, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id).then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    rest.menu = req.body;
                    return rest.save();
                }
            }).then(rest => {
                resp.json(rest.menu);
                return next();
            }).catch(next);
        };
        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id)
                .populate('owner', 'name')
                .then(this.render(resp, next))
                .catch(next);
        };
        this.findByOwner = (req, resp, next) => {
            if (req.query.owner) {
                restaurants_model_1.Restaurant.findByOwner(req.query.owner)
                    .then(restaurant => {
                    if (restaurant) {
                        return restaurant;
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
        this.findByOwnerAndName = (req, resp, next) => {
            if (req.query.owner && req.query.name) {
                restaurants_model_1.Restaurant.findByOwnerAndName(req.query.owner, req.query.name)
                    .then(restaurant => {
                    if (restaurant) {
                        return restaurant;
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
        application.get('/restaurants', [this.findByOwnerAndName, this.findByOwner, this.findAll]);
        application.get('/restaurants/:id', [this.validateId, this.findById]);
        application.post('/restaurants', [authz_handler_1.authorize('admin', 'owner'), this.save]);
        application.put('/restaurants/:id', [authz_handler_1.authorize('admin', 'owner'), this.validateId,
            this.replace]);
        application.patch('/restaurants/:id', [authz_handler_1.authorize('admin', 'owner'), this.validateId,
            this.update]);
        application.del('/restaurants/:id', [authz_handler_1.authorize('owner', 'admin'), this.validateId,
            this.delete]);
        application.get('/restaurants/:id/menu', [this.validateId, this.findMenu]);
        application.put('/restaurants/:id/menu', [authz_handler_1.authorize('admin', 'owner'), this.validateId,
            this.replaceMenu]);
    }
}
exports.restaurantsRouter = new RestaurantsRouter();
