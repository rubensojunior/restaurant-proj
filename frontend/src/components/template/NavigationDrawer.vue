<template>
    <v-navigation-drawer
        :value="drawer"
        app
        clipped
        color="#424242"
        dark
    >
        <v-list dense>
            <v-list-item>
                <v-select
                    :items="items"
                    label="Selecione o Restaurante"
                    background-color="#424242"
                    dark
                    @change="setRestaurant()"
                    v-model="item"
                >
                </v-select>
            </v-list-item>
            <v-list-item link to="/">
                <v-list-item-action>
                    <v-icon>mdi-view-dashboard</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Dashborad
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/restaurants">
                <v-list-item-action>
                    <v-icon>mdi-silverware-fork-knife</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Restaurants
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/menuselectrestaurant">
                <v-list-item-action>
                    <v-icon>mdi-food-fork-drink</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Cardápios
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/pedidos">
                <v-list-item-action>
                    <v-icon>mdi-file-document-box-multiple</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Pedidos
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex"
import { environment } from '../../common/environment'
import axios from 'axios'
export default {
    data(){
        return {
            items: [],
            item: ''
        }
    },
    computed: mapState(['drawer','restaurantSelected']),
    props: {
        source: String,
    },
    methods: {
        getRestaurants(){
            axios(`${environment.url.base}/restaurants`)
            .then(res =>{
                this.items = res.data.map(a => a.name)
            })
        },
        setRestaurant(){
            localStorage.setItem(environment.user.restaurant,this.item)
            this.$store.commit('setRestaurant', this.item)
        },
    },
    mounted () {
        this.item = this.restaurantSelected
        this.getRestaurants()
    },
}
</script>
