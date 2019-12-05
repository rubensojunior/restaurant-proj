<template>
    <div class="loading">
        <v-progress-circular
            :size="70"
            :width="7"
            color="#3D4AAC"
            indeterminate
        ></v-progress-circular>
    </div>
</template>
<script>
export default {
    name: 'Loading'
}
</script>
<style>
    .loading {
        grid-area: content;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>