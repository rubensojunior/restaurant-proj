"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const tables_model_1 = require("./tables.model");
const restify_errors_1 = require("restify-errors");
const authz_handler_1 = require("../security/authz.handler");
class TablesRouter extends model_router_1.ModelRouter {
    constructor() {
        super(tables_model_1.Table);
        this.findMenu = (req, resp, next) => {
            tables_model_1.Table.findById(req.params.id, "+menu").then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Table not found');
                }
                else {
                    resp.json(rest.menu);
                    return next();
                }
            }).catch(next);
        };
        this.replaceMenu = (req, resp, next) => {
            tables_model_1.Table.findById(req.params.id).then(rest => {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Table not found');
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
        this.findByOwnerAndName = (req, resp, next) => {
            if (req.query.owner && req.query.name) {
                tables_model_1.Table.findByOwnerAndName(req.query.owner, req.query.name)
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
        application.get('/tables', [this.findByOwnerAndName, this.findByOwner, this.findAll]);
        application.get('/tables/:id', [this.validateId, this.findById]);
        application.post('/tables', [authz_handler_1.authorize('admin', 'owner'), this.save]);
        application.put('/tables/:id', [authz_handler_1.authorize('admin', 'owner'), this.validateId,
            this.replace]);
        application.patch('/tables/:id', [authz_handler_1.authorize('admin'), this.validateId,
            this.update]);
        application.del('/tables/:id', [authz_handler_1.authorize('owner', 'admin'), this.validateId,
            this.delete]);
        application.get('/tables/:id/menu', [this.validateId, this.findMenu]);
        application.put('/tables/:id/menu', [authz_handler_1.authorize('admin'), this.validateId,
            this.replaceMenu]);
    }
}
exports.tablesRouter = new TablesRouter();
