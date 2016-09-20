<template>
    <div class="search">
        <mdl-textfield class="full-width" floating-label="Keyword" :value.sync="search.keyword"></mdl-textfield>
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--12-col">
                フラグ(チェック無しで全て)
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <mdl-checkbox v-mdl-ripple-effect :checked.sync="search.mark" value="first">初</mdl-checkbox>
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <mdl-checkbox v-mdl-ripple-effect :checked.sync="search.mark" value="last">終</mdl-checkbox>
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <mdl-checkbox v-mdl-ripple-effect :checked.sync="search.mark" value="live">生</mdl-checkbox>
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <mdl-checkbox v-mdl-ripple-effect :checked.sync="search.mark" value="bingeWatching">一挙</mdl-checkbox>
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <mdl-checkbox v-mdl-ripple-effect :checked.sync="search.mark" value="timeshift">TS可</mdl-checkbox>
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <mdl-checkbox v-mdl-ripple-effect :checked.sync="search.mark" value="paused">Paused</mdl-checkbox>
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <mdl-checkbox v-mdl-ripple-effect :checked.sync="search.mark" value="share">Share</mdl-checkbox>
            </div>
        </div>
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--12-col">
                詳細
            </div>
            <div class="mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-cell--12-col-phone">
                <mdl-checkbox v-mdl-ripple-effect :checked.sync="search.flag" value="title">タイトルのみ</mdl-checkbox>
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <mdl-radio v-mdl-ripple-effect :checked.sync="search.mode" value="and">AND</mdl-radio>
            </div>
            <div class="mdl-cell mdl-cell--2-col">
                <mdl-radio v-mdl-ripple-effect :checked.sync="search.mode" value="or">OR</mdl-radio>
            </div>
        </div>
        <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--12-col">
                チャンネル指定
            </div>
            <div class="mdl-cell mdl-cell--12-col">
                <mdl-button @click="selectAll"><i class="material-icons">check</i>SELECT ALL</mdl-button>
                <mdl-button @click="clearAll"><i class="material-icons">clear</i>CLEAR ALL</mdl-button>
            </div>
            <div class="mdl-cell mdl-cell--4-col" v-for="channel in channelList">
                <mdl-checkbox v-mdl-ripple-effect :checked.sync="search.channels" :value="channel.id">{{ channel.name }}</mdl-checkbox>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['search'],
        data() {
            return {
                channelList: []
            };
        },
        created() {
            this.$set("search", Object.assign({
                keyword: "",
                flag: [],
                channels: [],
                mark: [],
                mode: "and"
            }, this.search || {}));
            this.$timetable.then(media => {
                this.channelList = media.channels.map(item => {
                    return {
                        name: item.name.replace(/チャンネル$/,""),
                        id: item.id
                    };
                });
                this.search.channels = this.search.channels.length > 0 ? this.search.channels : media.channels.map(item => item.id);
            });
        },
        methods: {
            clearAll() {
                this.search.channels = [];
            },
            selectAll() {
                this.search.channels = this.channelList.map(item => item.id);
            }
        }
    }
</script>
<style scoped>    
    .full-width {
        width: 100%;
    }
    
    .mdl-list {
        border: 1px solid #ddd;
    }

    .mdl-checkbox {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>