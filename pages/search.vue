<template>
    <main class="mdl-layout__content">
        <search-query :search.sync="search"></search-query>

        <mdl-button raised colored v-mdl-ripple-effect @click="submit"><i class="material-icons">search</i> Search</mdl-button>
    </main>
</template>
<script>
    import SearchQuery from '../components/search-query.vue'
    export default {
        components: {
            SearchQuery: SearchQuery
        },
        data() {
            return {
                search: this.$route.query || null
            };
        },
        methods: {
            submit() {
                this.$router.go({ path: '/list', query: this.search })
                return false;
            }
        }
    }
</script>
<style scoped>
    main {
        padding: 30px 15%;
    }
</style>