import {Server} from './server/server'
import {usersRouter} from './users/users.router'
import {restaurantsRouter} from './restaurants/restaurants.router'
import {ordersRouter} from './orders/orders.router'
import { tablesRouter } from './tables/tables.router'
import { categoriesRouter } from './categories/categories.router'

const server = new Server()
server.bootstrap([
    usersRouter, 
    restaurantsRouter,
    ordersRouter,
    tablesRouter,
    categoriesRouter
]).then(server=>{
    console.log('Server is listening on:', server.application.address())
}).catch(error=>{
    console.log('Sever failed to start')
    console.log(error)
    process.exit(1)
})

