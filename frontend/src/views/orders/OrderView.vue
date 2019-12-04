<template>
    <v-data-table
        :headers="headers"
        :items="orders"
        class="elevation-1"
        dark
    >
        <template v-slot:top>
            <v-toolbar flat >
                <v-toolbar-title>{{`Pedidos do ${$store.state.restaurant.name}`}}</v-toolbar-title>
                <v-divider
                    class="mx-4"
                    inset
                    vertical
                >
                </v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">Adicionar</v-btn>
                </template>
                <v-card>
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-card-title>
                                <span class="headline">Pedido</span>
                            </v-card-title> 
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-card-title>
                                <v-btn class="ml-5"
                                    color="primary" 
                                    dark
                                    @click="addItem()"
                                >
                                    Adicionar Item
                                </v-btn>
                            </v-card-title>
                        </v-col>
                    </v-row>

                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-select
                                        :items="tablesName.map(a=>a.name)"
                                        label="Selecione a mesa"
                                        v-model="editedItem.table"
                                    ></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="editedItem.note" label="Observação"></v-text-field>
                                </v-col>
                            </v-row>
                             <v-card
                                class="mx-auto pt-2 pb-2 mt-5" 
                                v-for="(item,index) in editedItem.items" :key="index"
                            >
                                <v-card-title class="headline">{{ 'Item ' + (index+1) }}</v-card-title>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-select
                                                :items="itemsName.map(a=>a.name)"
                                                label="Selecione o prato"
                                                @change="itemChanged(index,itemsName)"
                                                v-model="itemSelected"
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="5">
                                            <v-text-field v-model="item.name" label="Prato" disabled></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="2">
                                            <v-text-field v-model="item.price" label="Preço" disabled></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="3">
                                            <v-text-field v-model="item.amount" label="Quantidade" type="number"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="2" md="2">
                                            <v-icon @click="removeItem(index)">mdi-delete</v-icon>
                                        </v-col>
                                    </v-row>
                                </v-container>
                             </v-card>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                        <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.action="{ item }">
            <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
            >
                mdi-pencil
            </v-icon>
            <v-icon
                small
                @click="deleteItem(item)"
            >
                mdi-delete
            </v-icon>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Resetar</v-btn>
        </template>
        <template v-slot:item.items="{item}">
            {{ item.items.map(a=>a.name.concat(' x',a.amount)).toString() }}
        </template>
    </v-data-table>
</template>

<script>
import axios from 'axios'
import { getAuth } from '../../common/axios'
import { environment } from '../../common/environment'
export default {
    data: () => ({
        dialog: false,
        headers: [
            {
                text: 'Mesa',
                align: 'left',
                value: 'table',
            },
            {
                text: 'Observações',
                value: 'note',
            },
            {
                text: 'Itens',
                align: 'left',
                value: 'items',
            },
            { text: 'Actions', value: 'action', sortable: false, align: 'right' },
        ],
        orders: [],
        editedIndex: -1,
        editedItem: {
            name: '',
            table: '',
            items: [ {price: 0, name: '', amount: 0} ]
        },
        defaultItem: {
            name: '',
            table: '',
            items: [ {price: 0, name: '', amount: 0} ]
        },
        itemsName: [],
        itemSelected: '',
        tablesName: []
    }),
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Novo Item' : 'Editar Item'
        }
    },
    mounted () {
        this.initialize()
    },
    methods: {
        initialize () {
            if(!this.checkValues()) return
            this.getOrders()
            this.getMenuItems()
            this.getTables()
        },
        getOrders(){
            axios(`${environment.url.base}/orders?owner=${this.$store.state.user.id}&restaurant=${this.$store.state.restaurant.id}`)
            .then(res =>{
                this.orders = res.data
            })
        },
        getMenuItems(){
            axios(`${environment.url.base}/restaurants/${this.$store.state.restaurant.id}/menu`)
            .then(res =>{
                this.itemsName = res.data
            })
        },
        getTables(){
            axios(`${environment.url.base}/tables?owner=${this.$store.state.user.id}&restaurant=${this.$store.state.restaurant.id}`)
            .then(res =>{
                this.tablesName = res.data
            })
        },
        itemChanged(index, itemsName){
            let item = itemsName.find(a => a.name === this.itemSelected)
            this.editedItem.items[index].name = item.name
            this.editedItem.items[index].price = item.price
        },
        editItem (item) {
            this.editedIndex = this.orders.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        close () {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },
        save() {
            if (this.editedIndex > -1) {
                this.updateItem()
            }else {
                this.createItem()
            }
        },
        checkValues(){
            let userId = this.$store.state.user.id
            let restaurantId = this.$store.state.restaurant.id
            if(userId == null || restaurantId == null) {
                return false
            }
            return true
        },
        createItem() {
            if(!this.checkValues()) return
            this.editedItem.owner = this.$store.state.user.id
            this.editedItem.restaurant = this.$store.state.restaurant.id
            this.editedItem.status = 'Em processamento'
            axios.post(`${environment.url.base}/orders`,this.editedItem,getAuth())
            .then(() =>{
                this.initialize()
                this.close()
            })
            .catch(()=>{
                alert('error')
            })
        },
        updateItem() {
            axios.put(`${environment.url.base}/orders/${this.editedItem._id}`,this.editedItem,getAuth())
            .then(() =>{
                this.initialize()
                this.close()
            })
            .catch(()=>{
                alert('error')
            })
        },
        deleteItem (item) {
            axios.delete(`${environment.url.base}/orders/${item._id}`,getAuth())
            .then(()=>{
                this.initialize()
            })
            .catch(error=>{
                alert(error)
            })
        },
        removeItem(index){
            this.editedItem.items.splice(index,1)
        },
        addItem(){
            this.editedItem.items.push(this.defaultItem)
        }
    },
}
</script>