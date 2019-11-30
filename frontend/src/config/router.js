import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '../views/LoginView'

Vue.use(VueRouter)

const routes = [{
    name: 'loginView',
    path: '/',
    component: LoginView
}]

export default new VueRouter({
    mode: 'history',
    routes
})