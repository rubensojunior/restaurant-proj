<template>
    <v-data-table
        :headers="headers"
        :items="menu"
        class="elevation-1"
        dark
        :items-per-page="15"
    >
        <template v-slot:top>
            <v-toolbar flat >
                <v-toolbar-title>{{`Cardápio do ${$store.state.restaurant.name}`}}</v-toolbar-title>
                <v-divider
                    class="mx-4"
                    inset
                    vertical
                >
                </v-divider>

                <v-spacer></v-spacer>

                <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on" @click="openDialog()">Editar</v-btn>
                </template>
                <v-card>
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-card-title>
                                <span class="headline">Cardápio</span>
                            </v-card-title> 
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-card-title>
                                <v-btn class="ml-5"
                                    color="primary" 
                                    dark
                                    @click="addItem()"
                                >
                                    Adicionar Prato
                                </v-btn>
                            </v-card-title>
                        </v-col>
                    </v-row>
                    
                    <v-card-text>
                        <v-container>
                            <v-card
                                class="mx-auto pt-4 pb-4 mt-5" v-for="(item, index) in menu" :key="index"
                            >
                                <v-card-title class="headline">{{ 'Prato ' + (index+1) }}</v-card-title>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-select
                                                :items="categories.map(a=>a.name)"
                                                label="Selecione uma categoria de prato"
                                                v-model.trim="menu[index].category"
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="10" md="5">
                                            <div class="input-container">
                                                <input 
                                                    id="name" 
                                                    class="inputMenu" 
                                                    type="text" 
                                                    pattern=".+"
                                                    v-model.trim="menu[index].name"
                                                />
                                                <label class="labelMenu" for="name">Prato</label>
                                            </div>
                                        </v-col>
                                        <v-col cols="12" sm="10" md="5">
                                            <div class="input-container">
                                                <money 
                                                    id="price" 
                                                    class="inputMenu" 
                                                    type="text" 
                                                    pattern=".+"
                                                    v-model="menu[index].price"
                                                    v-bind="money"
                                                />
                                                <label class="labelMenu" for="price">Preço</label>
                                            </div>
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
                        <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
                        <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">Resetar</v-btn>
        </template>
        <template v-slot:item.price="{item}">
            {{ item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
        </template>
    </v-data-table>
</template>

<script>
import axios from 'axios'
import { getAuth } from '../../common/axios'
import { environment } from '../../common/environment'
import {Money} from 'v-money'
import {isEmptyOrSpaces} from '../../common/helpers'
import { mapMutations } from 'vuex'
export default {
    components: {Money},
    data: () => ({
        dialog: false,
        headers: [
            {
                text: 'Nome',
                align: 'left',
                value: 'name',
            },
            {
                text: 'Preço (R$)',
                align: 'right',
                value: 'price',
            }
        ],
        money: {
            decimal: ',',
            thousands: '.',
            prefix: 'R$',
            suffix: '',
            precision: 2,
            masked: false,
        },
        menu: [],
        categories: []
    }),
    created () {
        this.initialize()
    },
    methods: {
        initialize () {
            if(!this.checkValues()) return
            this.getMenus()
            this.getCategories()
        },
        getMenus(){
            axios(`${environment.url.base}/restaurants/${this.$store.state.restaurant.id}/menu`)
            .then(res =>{
                this.menu = res.data
            })
        },
        getCategories(){
            axios(`${environment.url.base}/categories?owner=${this.$store.state.user.id}&restaurant=${this.$store.state.restaurant.id}`)
            .then(res =>{
                this.categories = res.data
            })
        },
        checkValues(){
            let userId = this.$store.state.user.id
            let restaurantId = this.$store.state.restaurant.id
            if(userId == null || restaurantId == null) {
                return false
            }
            return true
        },
        closeDialog() {
            this.dialog = false
            this.initialize()
        },
        openDialog(){
            this.dialog = true
        },
        save() {
            let restaurantId = this.$store.state.restaurant.id
            if(!this.runValidations()) return
            if(restaurantId == null) return
            axios.put(`${environment.url.base}/restaurants/${this.$store.state.restaurant.id}/menu`,this.menu,getAuth())
            .then(() =>{
                this.closeDialog()
                this.initialize()
            })
            .catch(error=>{
                this.showError(error)
            })
        },
        addItem(){
            this.menu.push({name: '', price: 0})
        },
        removeItem(index){
            this.menu.splice(index,1)
        },
        runValidations(){
            let hasErrors = true

            this.menu.forEach(element => {
                if(isEmptyOrSpaces(element.name)){
                    this.showError('Um ou mais nomes de prato não foram preenchidos')
                    hasErrors = false
                }

                if(element.price <= 0){
                    this.showError('Um ou mais preços não foram preenchidos')
                    hasErrors = false
                }
            });

            return hasErrors
        },
        showError(text){
            this.showSnackbar({ text, color: 'error'})
        },
        showSuccess(text){
            this.showSnackbar({ text, color: 'success'})
        },
        ...mapMutations(["showSnackbar", "closeSnackbar"]),
    },
}
</script>
<style >
    .input-container {
    position: relative;
    }

    .inputMenu {
    border: 0;
    border-bottom: 2px solid #9e9e9e;
    outline: none;
    transition: .2s ease-in-out;
    box-sizing: border-box;
    color:rgba(0, 0, 0, 0.87);
    }

    .labelMenu {
    top: 0;
    left: 0; right: 0;
    color: #616161;
    display: flex;
    align-items: center;
    position: absolute;
    font-size: 1rem;
    cursor: text;
    transition: .2s ease-in-out;
    box-sizing: border-box;
    }

    .inputMenu,
    .labelMenu {
    width: 100%;
    height: 3rem;
    font-size: 1rem;
    }

    /* Interation */
    .inputMenu:valid,
    .inputMenu:focus {
    border-bottom: 1.5px solid #1976d2;  
    }

    .inputMenu:valid + .labelMenu,
    .inputMenu:focus + .labelMenu {
    color: #1976d2;
    font-size: .9rem;
    top: -30px;
    pointer-events: none;
    }
</style>