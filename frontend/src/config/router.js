import Vue from 'vue'
import VueRouter from 'vue-router'

import LoginView from '../views/LoginView'

import HomeView from '../views/home/HomeView'

import RestaurantView from '../views/restaurant/RestaurantView'

import MenuView from '../views/menu/MenuView'

import OrderView from '../views/orders/OrderView'

import TableView from '../views/tables/TableView'

import CategoryView from '../views/categories/CategoryView'

Vue.use(VueRouter)

const routes = [{
    name: 'auth',
    path: '/auth',
    component: LoginView
},
{
    name: 'home',
    path: '/',
    component: HomeView
},  
{
    name: 'restaurants',
    path: '/restaurants',
    component: RestaurantView,
},  
{
    name: 'menu',
    path: '/menu',
    component: MenuView,
},  
{
    name: 'orders',
    path: '/orders',
    component: OrderView,
},  
{
    name: 'tables',
    path: '/tables',
    component: TableView,
},  
{
    name: 'categories',
    path: '/categories',
    component: CategoryView,
}]

export default new VueRouter({
    mode: 'history',
    routes
})