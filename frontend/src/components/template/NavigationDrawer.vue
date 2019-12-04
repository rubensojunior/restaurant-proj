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
                    v-model="restaurant.name"
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
            <v-list-item link to="/categories">
                <v-list-item-action>
                    <v-icon>mdi-shape</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Categorias de Pratos
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/menu">
                <v-list-item-action>
                    <v-icon>mdi-food-fork-drink</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Cardápios
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/tables">
                <v-list-item-action>
                    <v-icon>mdi-table-chair</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Mesas
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/orders">
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
        }
    },
    computed: {
        ...mapState(['drawer','restaurant']),
        item(){ return this.restaurant.name }
    },
    props: {
        source: String,
    },
    methods: {
        getRestaurants(){
            axios(`${environment.url.base}/restaurants?owner=${this.$store.state.user.id}`)
            .then(res =>{
                this.items = res.data.map(a => a.name)
            })
        },
        setRestaurant(){
            axios(`${environment.url.base}/restaurants?owner=${this.$store.state.user.id}&name=${this.item}`)
            .then(res=>{
                const restaurant = { 'name': this.item, 'id': res.data[0]._id }
                localStorage.setItem(environment.user.restaurant,JSON.stringify(restaurant))
                this.$store.commit('setRestaurant', restaurant)
                location.reload()
            })
            .catch(()=>{
                this.item = null
            })
        },
    },
    mounted() {
        this.getRestaurants()
    },
}
</script>
