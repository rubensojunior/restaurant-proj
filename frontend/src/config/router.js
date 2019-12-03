import Vue from 'vue'
import VueRouter from 'vue-router'

import LoginView from '../views/LoginView'

import HomeView from '../views/home/HomeView'

import RestaurantView from '../views/restaurant/RestaurantView'

import MenuRouter from '../views/menu/MenuRouter'
import MenuView from '../views/menu/MenuView'
import MenuSelectView from '../views/menu/MenuSelectView'

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
    name: 'menuselectrestaurant',
    path: '/menuselectrestaurant',
    component: MenuRouter,
    props: true,
    children: [
        { path: '', component: MenuSelectView},
        { path: ':id/menu', component: MenuView}
    ]
}]

export default new VueRouter({
    mode: 'history',
    routes
})