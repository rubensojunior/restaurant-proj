"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const tables_model_1 = require("./tables.model");
const authz_handler_1 = require("../security/authz.handler");
class TablesRouter extends model_router_1.ModelRouter {
    constructor() {
        super(tables_model_1.Table);
        this.findById = (req, resp, next) => {
            this.model.findById(req.params.id)
                .populate('owner', 'name')
                .then(this.render(resp, next))
                .catch(next);
        };
        this.findByOwner = (req, resp, next) => {
            if (req.query.owner) {
                tables_model_1.Table.findByOwner(req.query.owner)
                    .then(table => {
                    if (table) {
                        return table;
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
                tables_model_1.Table.findByOwnerAndRestaurant(req.query.owner, req.query.restaurant)
                    .then(table => {
                    if (table) {
                        return table;
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
        application.get('/tables', [this.findByOwnerAndRestaurant, this.findByOwner, this.findAll]);
        application.get('/tables/:id', [this.validateId, this.findById]);
        application.post('/tables', [authz_handler_1.authorize('admin', 'owner'), this.save]);
        application.put('/tables/:id', [authz_handler_1.authorize('admin', 'owner'), this.validateId,
            this.replace]);
        application.patch('/tables/:id', [authz_handler_1.authorize('admin', 'owner'), this.validateId,
            this.update]);
        application.del('/tables/:id', [authz_handler_1.authorize('owner', 'admin'), this.validateId,
            this.delete]);
    }
}
exports.tablesRouter = new TablesRouter();
