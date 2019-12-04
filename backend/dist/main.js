"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const restaurants_router_1 = require("./restaurants/restaurants.router");
const orders_router_1 = require("./orders/orders.router");
const tables_router_1 = require("./tables/tables.router");
const categories_router_1 = require("./categories/categories.router");
const server = new server_1.Server();
server.bootstrap([
    users_router_1.usersRouter,
    restaurants_router_1.restaurantsRouter,
    orders_router_1.ordersRouter,
    tables_router_1.tablesRouter,
    categories_router_1.categoriesRouter
]).then(server => {
    console.log('Server is listening on:', server.application.address());
}).catch(error => {
    console.log('Sever failed to start');
    console.log(error);
    process.exit(1);
});
