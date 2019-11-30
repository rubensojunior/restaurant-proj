<template>
	<v-app>
		<v-content>
			<SnackbarStore />
			<router-view  />
		</v-content>
	</v-app>
</template>

<script>
import SnackbarStore from './components/common/SnackbarStore'
export default {
	props: {
		source: String,
	},
	components: {
		SnackbarStore
	}
}
</script>