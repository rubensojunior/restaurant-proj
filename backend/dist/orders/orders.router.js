"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const orders_model_1 = require("./orders.model");
const restify_errors_1 = require("restify-errors");
const authz_handler_1 = require("../security/authz.handler");
class OrdersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(orders_model_1.Order);
        this.findItems = (req, resp, next) => {
            orders_model_1.Order.findById(req.params.id).then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Pedido não encontrado');
                }
                else {
                    resp.json(rest.items);
                    return next();
                }
            }).catch(next);
        };
        this.replaceMenu = (req, resp, next) => {
            orders_model_1.Order.findById(req.params.id).then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Pedido não encontrado');
                }
                else {
                    rest.items = req.body;
                    return rest.save();
                }
            }).then(rest => {
                resp.json(rest.items);
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
                orders_model_1.Order.findByOwner(req.query.owner)
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
        this.findByOwnerAndRestaurant = (req, resp, next) => {
            if (req.query.owner && req.query.restaurant) {
                orders_model_1.Order.findByOwnerAndRestaurant(req.query.owner, req.query.restaurant)
                    .then(order => {
                    if (order) {
                        return order;
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
        application.get('/orders', [this.findByOwnerAndRestaurant, this.findByOwner, this.findAll]);
        application.get('/orders/:id', [this.validateId, this.findById]);
        application.post('/orders', [authz_handler_1.authorize('admin', 'owner'), this.save]);
        application.put('/orders/:id', [authz_handler_1.authorize('admin', 'owner'), this.validateId,
            this.replace]);
        application.patch('/orders/:id', [authz_handler_1.authorize('admin'), this.validateId,
            this.update]);
        application.del('/orders/:id', [authz_handler_1.authorize('owner', 'admin'), this.validateId,
            this.delete]);
        application.get('/orders/:id/menu', [this.validateId, this.findItems]);
        application.put('/orders/:id/menu', [authz_handler_1.authorize('admin'), this.validateId,
            this.replaceMenu]);
    }
}
exports.ordersRouter = new OrdersRouter();
