<template>
    <v-data-table
        :headers="headers"
        :items="menu"
        class="elevation-1"
        dark
    >
        <template v-slot:top>
            <v-toolbar flat >
                <v-toolbar-title>Restautantes</v-toolbar-title>
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
            {
                text: 'Preço',
                value: 'price',
            },
            { text: 'Actions', value: 'action', sortable: false, align: 'right' },
        ],
        menu: [],
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
        async initialize () {
            axios(`${environment.url.base}/restaurants/${this.$route.params.id}/menu`)
            .then(res =>{
                this.menu = res.data
            })
            .catch(()=>{
                alert('deu error')
            })
        },
        editItem (item) {
            this.editedIndex = this.desserts.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem (item) {
            const index = this.desserts.indexOf(item)
            confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
        },
        close () {
            this.dialog = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            }, 300)
        },
        save () {
            this.editedItem.owner = this.$store.state.user.id
            axios.post(`${environment.url.base}/restaurants`,this.editedItem,getAuth())
            .then(() =>{
                this.initialize()
                this.close()
            })
            .catch(()=>{
                alert('error')
            })
        },
    },
}
</script>