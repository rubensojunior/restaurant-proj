<template>
    <v-navigation-drawer
        :value="drawer"
        app
        clipped
        color="#3D3D3D"
        dark
    >
        <v-list dense>
            <v-list-item link to="/">
                <v-list-item-action>
                    <v-icon>mdi-view-dashboard</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Dashborad
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/restaurants">
                <v-list-item-action>
                    <v-icon>mdi-silverware-fork-knife</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Restaurants
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/cardapios">
                <v-list-item-action>
                    <v-icon>mdi-silverware</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Cardápios
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-list-item link to="/cardapios">
                <v-list-item-action>
                    <v-icon>mdi-silverware</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title>
                        Cardápios
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex"
export default {
    computed: mapState(['drawer']),
    props: {
        source: String,
    }
}
</script>
