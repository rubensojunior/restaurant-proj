<template>
    <v-data-table
        :headers="headers"
        :items="restaurants"
        class="elevation-1"
        dark
    >
        <template v-slot:top>
            <v-toolbar flat >
                <v-toolbar-title>Restaurantes</v-toolbar-title>
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
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="12" md="12">
                                    <v-text-field v-model="editedItem.name" label="Nome"></v-text-field>
                                </v-col>
                            </v-row>
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
                text: 'Nome',
                align: 'left',
                value: 'name',
            },
            { text: 'Actions', value: 'action', sortable: false, align: 'right' },
        ],
        restaurants: [],
        editedIndex: -1,
        editedItem: {
            name: '',
        },
        defaultItem: {
            name: '',
        },
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
            axios(`${environment.url.base}/restaurants?owner=${this.$store.state.user.id}`)
            .then(res =>{
                this.restaurants = res.data
            })
        },
        editItem (item) {
            this.editedIndex = this.restaurants.indexOf(item)
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
        createItem() {
            this.editedItem.owner = this.$store.state.user.id
            axios.post(`${environment.url.base}/restaurants`,this.editedItem,getAuth())
            .then(() =>{
                this.initialize()
                this.close()
                this.deleteRestaurantFromStore()
            })
            .catch(()=>{
                alert('error')
            })
        },
        updateItem() {
            axios.patch(`${environment.url.base}/restaurants/${this.editedItem._id}`,this.editedItem,getAuth())
            .then(() =>{
                this.initialize()
                this.close()
                this.deleteRestaurantFromStore()
            })
            .catch(()=>{
                alert('error')
            })
        },
        deleteItem (item) {
            axios.delete(`${environment.url.base}/restaurants/${item._id}`,getAuth())
            .then(()=>{
                this.initialize()
                this.deleteRestaurantFromStore()
            })
            .catch(error=>{
                alert(error)
            })
        },
        deleteRestaurantFromStore(){
            localStorage.removeItem(environment.user.restaurant)
            this.$store.commit('setRestaurant','3')
            this.$router.go()
        }
    },
}
</script>