<template>
    <main class="mdl-layout__content">
        <search-query :search.sync="search"></search-query>
        <hr />
        <mdl-textfield class="full-width" floating-label="Name" :value.sync="name"></mdl-textfield>
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--6-col">
                <mdl-radio v-mdl-ripple-effect :checked.sync="mode" value="timetable" id="timetable">TIMETABLE(CH指定のみ)</mdl-radio>
            </div>
            <div class="mdl-cell mdl-cell--6-col">
                <mdl-radio v-mdl-ripple-effect :checked.sync="mode" value="list">LIST</mdl-radio>
            </div>
        </div>
        <mdl-button raised colored v-mdl-ripple-effect :disabled="!name" @click="add"><i class="material-icons">add</i> ADD</mdl-button>
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
            return {
                search: {},
                name: '',
                mode: 'timetable'
            };
        },
        methods: {
            add() {
                this.customList.push({
                    name: this.name,
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