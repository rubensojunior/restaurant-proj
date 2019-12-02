import Vue from 'vue'
import VueRouter from 'vue-router'

import LoginView from '../views/LoginView'

import HomeView from '../views/home/HomeView'

import RestaurantView from '../views/restaurant/RestaurantView'

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
}]

export default new VueRouter({
    mode: 'history',
    routes
})