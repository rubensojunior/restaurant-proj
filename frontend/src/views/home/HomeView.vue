<template>
  <v-card
    class="mx-auto"
    max-width="1200"
  >
    <v-img
      class="white--text align-end"
      height="400px"
      src="../../assets/restaurant.jpg"
    >
      <v-card-title>EJ Manager - Versão Web</v-card-title>
    </v-img>

    <div
    id="e3"
    style="max-width: 1200px; margin: auto;"
    class="grey lighten-3"
  >
    <v-toolbar color="rgb(61, 74, 172)">
      <v-toolbar-title class="white--text">Últimos Pedidos</v-toolbar-title>
    </v-toolbar>
    <b-card-group>
    <b-card :title="item.table" v-for="(item, index) in orders" :key="index">
      <b-card-text v-for="(itemInsideItems, indexInsideItems) in orders[index].items" :key="indexInsideItems">
          <v-row>
              <v-col cols="12" sm="12" md="8">
                    {{ item.items[indexInsideItems].name.toString() }}
              </v-col>
              
              <v-col cols="12" sm="12" md="4">
                    {{ item.items[indexInsideItems].price.toString() + 'x'}}
             </v-col>
             <v-divider style="height:10px"></v-divider>
          </v-row>
          <v-divider v-if="index < orders.length" :key="`divider-${index}`"></v-divider>
      </b-card-text>
      <template v-slot:footer>
        <small class="text-muted">{{ new Date(item.creationDate).toLocaleTimeString([], {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'}) }}</small>
      </template>
    </b-card>
  </b-card-group>
  </div>
  </v-card>
</template>

<script>
import axios from 'axios'
import {environment} from '../../common/environment'
export default {
    data(){
        return {
            orders: []
        }
    },
    methods: {
        initialize(){
            if(!this.checkValues()) return
            axios(`${environment.url.base}/orders?owner=${this.$store.state.user.id}&restaurant=${this.$store.state.restaurant.id}`)
            .then(res =>{
                let order = res.data
                let lastOrders = order.slice(-5)
                let lastOrdersOrdenedByDesc = 
                lastOrders.sort(function (a, b) {
                    if (a.creationDate < b.creationDate) {
                        return 1;
                    }
                    if (a.creationDate > b.creationDate) {
                        return -1;
                    }
                    return 0;
                })
                this.orders = lastOrdersOrdenedByDesc
            })
        },
        checkValues(){
            let userId = this.$store.state.user.id
            let restaurantId = this.$store.state.restaurant.id
            if(userId == null || restaurantId == null) {
                return false
            }
            return true
		}
    },
    mounted(){
        this.initialize()
    }
}
</script>