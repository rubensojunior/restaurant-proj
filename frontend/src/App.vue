<template>
	<v-app>
		<AppBar v-if="user"/>
		<NavigationDrawer v-if="user" />
		<v-content>
			<SnackbarStore />
			<Loading v-if="validantingToken" />
			<LoginView v-else-if="!validantingToken && !user" />
			<ContentView v-else />	
		</v-content>
		<v-footer app color="#424242" dark>
            <span>&copy; 2019</span>
        </v-footer>
	</v-app>
</template>

<script>
import LoginView from './views/LoginView'
import ContentView from './views/ContentView'
import NavigationDrawer from './components/template/NavigationDrawer'
import AppBar from './components/template/AppBar'
import SnackbarStore from './components/common/SnackbarStore'
import Loading from './components/template/Loading'
import {environment} from './common/environment'
import axios from 'axios'
import { mapState } from "vuex"
export default {
	computed: mapState(['user']),
	data(){
		return {
			validantingToken: true
		}
	},
	props: {
		source: String,
	},
	components: {
		LoginView,ContentView,SnackbarStore,Loading,NavigationDrawer,AppBar
	},
	methods: { 
        async validateToken(){			           
			this.validantingToken = true

			const json = localStorage.getItem(environment.user.key)
			const userData = JSON.parse(json)
			this.$store.commit('setUser', null)

			if(!userData) {
				this.validantingToken = false
				if(this.$route.name !== 'auth') this.$router.push({ name: 'auth' })
				return
			}

			const auth = {
                headers: {Authorization:'Bearer ' + userData.accessToken} 
			}

			await axios(`${environment.url.base}/users/${userData.id}`,auth)
			.then(() =>{
				this.$store.commit('setUser',userData)
			})
			.catch(()=>{
				localStorage.removeItem(environment.user.key)
				this.$router.push({ name: 'auth' })
			})

			this.validantingToken = false
		},
		setRestaurant(){
			const restaurant = localStorage.getItem(environment.user.restaurant)
			this.$store.commit('setRestaurant',restaurant)
		}
    },
    created(){
		this.validateToken()
		this.setRestaurant()
    }
}
</script>