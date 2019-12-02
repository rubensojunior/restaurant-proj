<template>
    <v-app-bar
        app
        clipped-left
        color="#3D4AAC"
        dark
    >
        <v-app-bar-nav-icon @click.stop="setDrawer()" />
        <v-toolbar-title>Application</v-toolbar-title>
        <UserDropdown />
    </v-app-bar>
</template>
<script>
import UserDropdown from './UserDropdown'
import { mapState } from "vuex"
export default {
    computed: mapState(['drawer']),
    components: {
        UserDropdown
    },
    methods: {
        setDrawer(){
            this.$store.commit('setDrawer',!this.drawer)
        }
    }
}
</script>