<template>
    <main class="mdl-layout__content">
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--1-col">
            </div>
            <div class="mdl-cell mdl-cell--10-col">
                <div class="sort">
                    SORT
                    <mdl-button @click.prevent="sort('startAt')" colored raised v-mdl-ripple-effect>DATE</mdl-button>
                    <mdl-button @click.prevent="sort('channelId')" colored raised v-mdl-ripple-effect>CHANNEL</mdl-button>
                    <mdl-button @click.prevent="sort('title')" colored raised v-mdl-ripple-effect>TITLE</mdl-button>
                </div>
                <table class="mdl-data-table mdl-js-data-table mdl-shadow--4dp" v-if="slots">
                    <thead>
                        <tr>
                            <th class="mdl-data-table__cell--non-numeric"><a @click.prevent="sort('startAt')" href="#">DATE</a></th>
                            <th class="mdl-data-table__cell--non-numeric"><a @click.prevent="sort('channelId')" href="#">CHANNEL</a></th>
                            <th class="mdl-data-table__cell--non-numeric"><a @click.prevent="sort('title')" href="#">TITLE</a></th>
                        </tr>
                    </thead>
                    <tbody v-el:table>
                        <tr v-for="slot in slots | findSlot search | orderBy sortKey sortMode | setPage | limitBy 50 offset | setButtons">
                            <td class="mdl-data-table__cell--non-numeric">{{ moment(slot.startAt * 1000).format('MM/DD(ddd) HH:mm') }} - {{ moment(slot.endAt * 1000).format('HH:mm') }}</td>
                            <td class="mdl-data-table__cell--non-numeric"><a v-link="{ 'path': '/list/channel/' + slot.channelId }">{{ findChannel(slot.channelId) }}</a></td>
                            <td class="mdl-data-table__cell--non-numeric">
                                <span class="mark" v-if="slot.mark.first">初</span>
                                <span class="mark" v-if="slot.mark.live">生</span>
                                <a v-link="{ 'name': 'details', params: { channelId: slot.channelId, slotId: slot.id }}">{{ slot.title }}</a>
                                <span class="mark" v-if="slot.mark.last">終</span>                            
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="mdl-cell mdl-cell--1-col">
            </div>
        </div>
        <div class="mdl-grid footer-button">
            <div>
                <mdl-button icon raised :disabled="disablePrev" @click="jumpPage(-1)"><i class="material-icons">chevron_left</i></mdl-button>
            </div>
            <div>
                {{ offset }} / {{ allItems }}
            </div>
            <div>
                <mdl-button icon raised :disabled="disableNext" @click="jumpPage(1)"><i class="material-icons">chevron_right</i></mdl-button>
            </div>
        </div>
    </main>
</template>
<script>
    import moment from 'moment'
    export default {
        props: ['customList'],
        data() {
            let search = this.$route.query || {};
            if("custom" in this.$route.query) {
                search = this.customList[this.$route.query.custom] ? this.customList[this.$route.query.custom].query : {};
            }
            return {
                slots: null,
                channels: {},
                offset: (this.$route.query.page || 0) * 50,
                search: search,
                sortKey: this.$route.query.sort || 'startAt',
                sortMode: this.$route.query.sortMode || 1,
                tableItems: 0,
                disablePrev: true,
                disableNext: true,
                pageItems: 0,
                allItems: 0
            };
        },
        computed: {
            showPrev() { return this.offset > 0; },
            showNext() { return this.tableItems == 50; }
        },
        compiled() {
            this.begin();
        },
        methods: {
            moment: moment,
            begin() {
                this.$timetable.then(media => {
                    media.channels.forEach(item => {
                        this.channels[item.id] = item.name.replace(/チャンネル$/,"");
                    });
                    let time = moment().unix();
                    let slots = media.programs.filter(item => time < item.endAt);
                    if("channelId" in this.$route.params) {
                        slots = slots.filter(item => item.channelId == this.$route.params.channelId);
                    }
                    this.slots = slots;
                });
            },
            sort(item) {
                this.$router.go({
                    query: Object.assign(this.$route.query, { sort: item, sortMode: this.sortMode * -1, page: 0 })
                });
                this.sortKey = item;
                this.sortMode = this.sortMode * -1;
                return false;
            },
            findChannel(id) {
                return this.channels[id] || "";
            },
            jumpPage(num) {
                this.$router.go({
                    query: Object.assign(this.$route.query, { page: parseInt(this.$route.query.page || 0) + num })
                });
            }
        },
        watch: {
            "$route.query": {
                deep: true,
                handler() {
                    this.sortKey = this.$route.query.sort || 'startAt';
                    this.sortMode = parseInt(this.$route.query.sortMode || 1);
                    this.offset = (this.$route.query.page || 0) * 50;
                    let search = this.$route.query || {};
                    if("custom" in this.$route.query) {
                        search = this.customList[this.$route.query.custom] ? this.customList[this.$route.query.custom].query : {};
                    }
                    this.search = search;
                }
            },
            "$route.params": {
                deep: true,
                handler() {
                    this.begin();
                }
            }
        },
        filters: {
            setButtons(array) {
                this.disablePrev = this.offset == 0;
                this.disableNext = array.length < 50;
                return array;
            },
            setPage(array) {
                this.allItems = array.length;
                return array;
            }
        }
    }
</script>
<style scoped>
    main {
        overflow: scroll;
    }
    
    table {
        width: 100%;
    }

    .footer-button {
        display: flex;
        justify-content: space-between;
        margin: 0 15%;
    }

    tr > td:nth-child(1) {
        max-width: 160px;
        width: 160px;
    }

    tr > td:nth-child(2) {
        max-width: 160px;
        width: 160px;
    }

    tr > td:nth-child(2), tr > td:nth-child(3) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    tr > td > a {
        text-decoration: none;
        color: rgb(0,188,212);
    }
    .mark {
        border: 1.5px solid #f00;
        border-radius: 2px;
        background: #f00;
        font-size: 10px;
        text-decoration: none;
    }

    .sort {
        display: none;
    }

    .is-small-screen .sort {
        display: block;
        margin-bottom: 10px;
    }

    .is-small-screen table {
        table-layout: fixed;
    }

    .is-small-screen tbody {
        max-width: calc(100% - 32px);
    }

    .is-small-screen thead {
        display: none;
    }

    .is-small-screen tbody tr {
        display: flex;
        flex-direction: column;
        height: unset !important;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        overflow: hidden;
    }

    .is-small-screen tbody td {
        max-width: unset !important;
        height: 24px;
        border-top: 0;
        border-bottom: 0;
        padding-top: 0;
        padding-bottom: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .is-small-screen tbody td:nth-child(1) {
        order: 0;
        padding-left: 18px;
        font-weight: bold;
        margin-top: 8px;
        width: unset !important;
    }

    .is-small-screen tbody td:nth-child(3) {
        order: 1;
        padding-left: 24px;
    }

    .is-small-screen tbody td:nth-child(2) {
        order: 2;
        padding-left: 24px;
        font-size: 12px;
    }
</style>