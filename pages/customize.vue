<template>
    <main class="mdl-layout__content">
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--1-col">
            </div>
            <div class="mdl-cell mdl-cell--10-col">
                <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric">ID</th>
                            <th class="mdl-data-table__cell--non-numeric">NAME</th>
                            <th class="mdl-data-table__cell--non-numeric">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(index, item) in customList">
                            <td class="mdl-data-table__cell--non-numeric" v-text="index"></td>
                            <td class="mdl-data-table__cell--non-numeric" v-text="item.name"></td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <a v-link="{ path: '/customize/edit/' + index }">EDIT</a>
                                <a href="#" @click.prevent="deleteItem(index)">DELETE</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="mdl-cell mdl-cell--1-col">
            </div>
        </div>
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--10-col mdl-cell--1-offset">
                <mdl-button raised colored primary v-mdl-ripple-effect v-link="{ path: '/customize/add' }"><i class="material-icons">add</i> NEW</mdl-button>
            </div>
        </div>
    </main>
</template>
<script>
    export default {
        props: ['customList'],
        methods: {
            deleteItem(index) {
                this.customList.splice(index, 1);
            }
        }
    }
</script>
<style scoped>
    table {
        width: 100%;
    }

    tr > td:nth-child(1) {
        max-width: 50px;
    }

    tr > td:nth-child(3) {
        max-width: 140px;
    }
</style>