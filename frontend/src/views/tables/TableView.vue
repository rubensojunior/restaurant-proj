<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="tables"
            class="elevation-1"
            dark
            v-if="pageLoaded"
        >
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>{{`Mesas do ${$store.state.restaurant.name}`}}</v-toolbar-title>
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
                                        <v-text-field v-model.trim="editedItem.name" label="Nome" ref="tfName"></v-text-field>
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
        <b-card bg-variant="dark" text-variant="white" title="Ocorreu um erro na exibição da página" v-else>
            <b-card-text>
                Não foi possível carregar a página, verifique se selecionou um restaurante e tente novamente.
            </b-card-text>
            <b-button variant="primary" @click="initialize()">Recarregar</b-button>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios'
import { getAuth } from '../../common/axios'
import { environment } from '../../common/environment'
import {isEmptyOrSpaces} from '../../common/helpers'
import { mapMutations } from 'vuex'
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
        tables: [],
        editedIndex: -1,
        editedItem: {
            name: '',
        },
        defaultItem: {
            name: '',
        },
        pageLoaded: true
    }),
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Adicionar Mesa' : 'Editar Mesa'
        }
    },
    mounted () {
        this.initialize()
    },
    methods: {
        initialize () {
            if(!this.checkValues()) this.pageLoaded = false
            axios(`${environment.url.base}/tables?owner=${this.$store.state.user.id}&restaurant=${this.$store.state.restaurant.id}`)
            .then(res =>{
                this.tables = res.data
            })
        },
        editItem (item) {
            this.editedIndex = this.tables.indexOf(item)
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
        checkValues(){
            let userId = this.$store.state.user.id
            let restaurantId = this.$store.state.restaurant.id
            if(userId == null || restaurantId == null) {
                return false
            }
            return true
        },
        save() {
            if(!this.runValidations()) return
            if (this.editedIndex > -1) {
                this.updateItem()
            }else {
                this.createItem()
            }
        },
        createItem() {
            if(!this.checkValues()) return
            this.editedItem.owner = this.$store.state.user.id
            this.editedItem.restaurant = this.$store.state.restaurant.id
            axios.post(`${environment.url.base}/tables`,this.editedItem,getAuth())
            .then(() =>{
                this.initialize()
                this.close()
                this.showSuccess('Mesa cadastrada com sucesso!')
            })
            .catch(error=>{
                this.showError(error)
            })
        },
        updateItem() {
            axios.patch(`${environment.url.base}/tables/${this.editedItem._id}`,this.editedItem,getAuth())
            .then(() =>{
                this.initialize()
                this.close()
                this.showSuccess('Mesa editada com sucesso!')
            })
            .catch(error=>{
                this.showError(error)
            })
        },
        deleteItem (item) {
            this.$bvModal.msgBoxConfirm('Deseja mesmo excluir a mesa ' + item.name + '?', {
            okTitle: 'Sim',
            cancelTitle: 'Não',
            cancelVariant: 'danger',
            })
            .then(value => {
                if(value){
                    axios.delete(`${environment.url.base}/tables/${item._id}`,getAuth())
                    .then(()=>{
                        this.initialize()
                        this.showSuccess('Mesa excluída com sucesso!')
                    })
                    .catch(error=>{
                        this.showError(error)
                    })
                }
            })
        },
        runValidations(){
            if(isEmptyOrSpaces(this.editedItem.name)){
                this.showError('Preencha o nome da mesa para continuar')
                this.focus('tfName')
                return false
            }
            return true
        },
        focus(field){
            this.$refs[field].focus()
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