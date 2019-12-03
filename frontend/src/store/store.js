import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		snackbar: {
			visible: false,
			text: null,
			timeout: 6000,
			multiline: false,
			color: '',
			icon: ''
		},
		user: null,
		drawer: true,
		restaurantSelected: null
	},
	mutations: {
		setUser(state, user) {
            state.user = user
		},
		setRestaurant(state, restaurant){
			state.restaurantSelected = restaurant
		},
		setDrawer(state,drawer){
			state.drawer = drawer
		},
		showSnackbar(state, payload) {
			state.snackbar.text = payload.text
			state.snackbar.multiline = (payload.text.length > 50) ? true : false

			if (payload.multiline) {
				state.snackbar.multiline = payload.multiline
			}

			if (payload.timeout) {
				state.snackbar.timeout = payload.timeout
			}

			if (payload.color) {
				state.snackbar.color = payload.color
			}

			if (payload.color) {
				if(payload.color === 'error'){
					state.snackbar.icon = 'mdi-close-octagon'
				}else if(payload.color === 'success'){
					state.snackbar.icon = 'mdi-check-circle'
				}	
			} 

			state.snackbar.visible = true
		},
		closeSnackbar(state) {
			state.snackbar.visible = false
			state.snackbar.multiline = false
			state.snackbar.timeout = 6000
			state.snackbar.text = null
			state.snackbar.color = ''
			state.snackbar.icon = ''
		},
	}
})