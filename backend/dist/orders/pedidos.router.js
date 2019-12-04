"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const pedidos_model_1 = require("./pedidos.model");
const restify_errors_1 = require("restify-errors");
const authz_handler_1 = require("../security/authz.handler");
class PedidosRouter extends model_router_1.ModelRouter {
    constructor() {
        super(pedidos_model_1.Pedido);
        this.findItens = (req, resp, next) => {
            pedidos_model_1.Pedido.findById(req.params.id).then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Pedido não encontrado');
                }
                else {
                    resp.json(rest.itens);
                    return next();
                }
            }).catch(next);
        };
        this.replaceMenu = (req, resp, next) => {
            pedidos_model_1.Pedido.findById(req.params.id).then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Pedido não encontrado');
                }
                else {
                    rest.itens = req.body;
                    return rest.save();
                }
            }).then(rest => {
                resp.json(rest.itens);
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
                pedidos_model_1.Pedido.findByOwner(req.query.owner)
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
        application.get('/pedidos', [this.findByOwner, this.findAll]);
        application.get('/pedidos/:id', [this.validateId, this.findById]);
        application.post('/pedidos', [authz_handler_1.authorize('admin', 'owner'), this.save]);
        application.put('/pedidos/:id', [authz_handler_1.authorize('admin', 'owner'), this.validateId,
            this.replace]);
        application.patch('/pedidos/:id', [authz_handler_1.authorize('admin'), this.validateId,
            this.update]);
        application.del('/pedidos/:id', [authz_handler_1.authorize('owner', 'admin'), this.validateId,
            this.delete]);
        application.get('/pedidos/:id/menu', [this.validateId, this.findItens]);
        application.put('/pedidos/:id/menu', [authz_handler_1.authorize('admin'), this.validateId,
            this.replaceMenu]);
    }
}
exports.pedidosRouter = new PedidosRouter();
