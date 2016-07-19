<template>
    <main class="mdl-layout__content" v-if="search">
        <search-query :search.sync="search"></search-query>
        <hr />
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--6-col">
                <mdl-radio v-mdl-ripple-effect :checked.sync="mode" value="timetable" id="timetable">TIMETABLE(CH指定のみ)</mdl-radio>
            </div>
            <div class="mdl-cell mdl-cell--6-col">
                <mdl-radio v-mdl-ripple-effect :checked.sync="mode" value="list">LIST</mdl-radio>
            </div>
        </div>
        <mdl-button raised colored v-mdl-ripple-effect @click="change"><i class="material-icons">done</i> CHANGE</mdl-button>
    </main>
</template>
<script>
    import SearchQuery from '../../components/search-query.vue'
    export default {
        props: ['customList'],
        components: {
            SearchQuery: SearchQuery
        },
        data() {
            if(this.customList[this.$route.params.id]){
                return {
                    search: this.customList[this.$route.params.id].query,
                    mode: this.customList[this.$route.params.id].mode
                };
            } else {
                return {};
            }
        },
        methods: {
            change() {
                this.customList[this.$route.params.id] = Object.assign(this.customList[this.$route.params.id], {
                    query: this.search,
                    mode: this.mode
                });
                this.$router.go({ path: '/customize' });
                return false;
            }
        }
    }
</script>
<style scoped>
    main {
        padding: 30px 15%;
    }
    .full-width {
        width: 100%;
    }
</style>