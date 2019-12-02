<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat >
                        <v-toolbar-title>JR RestManager</v-toolbar-title>
                        <v-spacer />
                    </v-toolbar>
                    <v-card-text>
                        <v-form>
                            <v-text-field
                                label="Nome"
                                name="name"
                                prepend-icon="mdi-account-circle"
                                type="text"
                                v-model.trim="user.name"
                                ref="tfName"
                                v-if="screen === '2'"
                            />

                            <v-radio-group v-model="user.gender" color="black" v-if="screen === '2'">
                                <template v-slot:label>
                                    <div>Selecione seu sexo:</div>
                                </template>
                                <v-radio value="Male" color="primary">
                                    <template v-slot:label>
                                    <div>Masculino</div>
                                    </template>
                                </v-radio>
                                <v-radio value="Female" color="primary">
                                    <template v-slot:label>
                                    <div>Feminino</div>
                                    </template>
                                </v-radio>
                            </v-radio-group>

                            <v-text-field
                                label="E-mail"
                                name="email"
                                prepend-icon="mdi-email"
                                type="text"
                                v-model.trim="user.email"
                                ref="tfEmail"
                            />

                            <v-text-field
                                label="CPF"
                                name="cpf"
                                prepend-icon="mdi-account-card-details"
                                type="text"
                                v-model.trim="user.cpf"
                                ref="tfCpf"
                                v-mask="mask"
                                v-if="screen === '2'"
                            />

                            <v-text-field
                                id="senha"
                                label="Senha"
                                name="password"
                                prepend-icon="mdi-lock"
                                type="password"
                                v-model.trim="user.password"
                                ref="tfPassword"
                                @keyup.enter="login"
                                v-if="screen !== '3'"
                            />

                            <v-text-field
                                id="senha"
                                label="Repetir Senha"
                                name="senharepetida"
                                prepend-icon="mdi-lock"
                                type="password"
                                v-model.trim="passwordRepeated"
                                ref="tfPasswordRepeated"
                                v-if="screen === '2'"
                            />
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn 
                            text 
                            color="primary" 
                            small
                            @click="navigateScreens('2')"
                            v-if="screen === '1'"
                        >
                            Criar conta
                        </v-btn>
                        <v-btn 
                            text 
                            color="primary" 
                            small
                            @click="navigateScreens('1')"
                            v-if="screen !== '1'"
                        >
                            Voltar
                        </v-btn>
                        <v-btn 
                            text 
                            color="primary" 
                            small
                            @click="navigateScreens('3')"
                            v-if="screen === '1'"
                        >
                            Recuperar Senha
                        </v-btn>
                        <v-btn 
                            color="primary" 
                            @click="login()"
                            v-if="screen === '1'"
                        >
                            Login
                        </v-btn>
                        <v-btn 
                            color="primary" 
                            @click="register()"
                            v-if="screen === '2'"
                        >
                            Cadastrar
                        </v-btn>
                        <v-btn 
                            color="primary" 
                            @click="recoverPass()"
                            v-if="screen === '3'"
                        >
                            Recuperar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'
import {environment} from '../common/environment'
import {isEmptyOrSpaces} from '../common/helpers'
import {mask} from 'vue-the-mask'
import { mapMutations } from 'vuex'
export default {
    data() {
        return {
            user: {},
            passwordRepeated: '',
            mask: '###.###.###-##',
            screen: '1',
        }
    },
    computed: {
        isVisibleSnack(){ return this.successMessage !== '' },
        tfEmail(){ 
            if(isEmptyOrSpaces(this.user.email)){ 
                return true
            } else{ 
                return false 
            }
        },
        
    },
    directives: {
      mask,
    },
    methods: {
        ...mapMutations(["showSnackbar", "closeSnackbar"]),
        showError(text){
            this.showSnackbar({ text, color: 'error'})
        },
        navigateScreens(screen){
            this.user = {}
            this.screen = screen
        },
        getErrorResponse(error){
            let response = error.response.data
            let errorText = ''

            if(response.errors) response.errors.forEach(element => errorText += element.message)
            else if(response) errorText += response.message
            
            return errorText
        },
        register(){
            if(!this.validateRegistration()) return

            this.user.profiles = ['owner']

            axios.post(`${environment.url.base}/users`,this.user)
            .then(()=>{
                this.navigateScreens('1')
                this.showSnackbar({ text: 'Usuário cadastrado com sucesso!', 
                    color: 'success'})
            })
            .catch(error =>{
                let errorResponse = this.getErrorResponse(error)

                if(errorResponse === ''){
                    this.showError('Ocorreu um erro inesperado')
                    return
                }

                if(errorResponse.includes("Path `email` is invalid")){
                    this.showError('Forneça um e-mail válido')
                    this.focus('tfEmail')
                }else if(errorResponse.includes('duplicate key error')){
                    this.showError('O e-mail já existe na nossa base de dados')
                    this.focus('tfEmail')
                }else if(errorResponse.includes('Invalid CPF')){
                    this.showError('Forneça um CPF válido')
                    this.focus('tfCpf')
                }
                else{
                    this.showError(errorResponse)
                }
           })
        },
        login(){
            if(this.screen !== '1') return
            if(!this.validateLogin()) return
            
            axios.post(`${environment.url.base}/users/authenticate`,this.user)
            .then(res=>{
                this.showSnackbar({ text: 'Usuário logado com sucesso!', 
                    color: 'success'})
                this.$store.commit('setUser', res.data)
                localStorage.setItem(environment.user.key, JSON.stringify(res.data))
                this.$router.push({ path: '/' })
            })
            .catch(error =>{
                 let errorResponse = this.getErrorResponse(error)

                if(errorResponse === ''){
                    this.showError('Ocorreu um erro inesperado')
                    return
                }

                if(errorResponse.includes("Invalid Credentials")){
                    this.showError('Credenciais inválidas')
                } else {
                    this.showError(errorResponse)
                }
            })
        },
        validateRegistration(){
            if(isEmptyOrSpaces(this.user.name)){
                this.showError('Preencha o nome para continuar')
                this.focus('tfName')
                return false
            }
            if(this.user.name.length < 3){
                this.showError('O nome deve conter pelo menos 3 caracteres')
                this.focus('tfName')
                return false
            }
            if(this.user.gender == null){
                this.showError('Selecione o sexo para continuar')
                return false
            }
            if(isEmptyOrSpaces(this.user.email)){
                this.showError('Preencha o e-mail para continuar')
                this.focus('tfEmail')
                return false
            }
            if(isEmptyOrSpaces(this.user.cpf)){
                this.showError('Preencha o CPF para continuar')
                this.focus('tfCpf')
                return false
            }
            if(isEmptyOrSpaces(this.user.password)){
                this.showError('Preencha a senha para continuar')
                this.focus('tfPassword')
                return false
            }
            if(isEmptyOrSpaces(this.passwordRepeated)){
                this.showError('Preencha o campo repetir senha para continuar')
                this.focus('tfPasswordRepeated')
                return false
            }
            if(this.user.password.length < 8){
                this.showError('A senha deve conter pelo menos 8 caracteres')
                this.focus('tfPassword')
                return false
            }
            if(this.user.password !== this.passwordRepeated){
                this.showError('As senhas não coincidem')
                this.focus('tfPassword')
                this.user.password = ''
                this.passwordRepeated = ''
                return false
            }
            return true
        },
        validateLogin(){
            if(isEmptyOrSpaces(this.user.email)){
                this.showError('Preencha o e-mail para continuar')
                this.focus('tfEmail')
                return false
            }
            if(isEmptyOrSpaces(this.user.password)){
                this.showError('Preencha a senha para continuar')
                this.focus('tfPassword')
                return false
            }
            return true
        },
        focus(field){
            this.$refs[field].focus()
            this.$refs[field].error = true
        }
    }
}
</script>