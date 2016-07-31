<template>
    <mdl-cardpage width="70" title="設定">
        <ul class="mdl-list">
            <setting-item v-for="entry in entrys" :app-setting.sync="appSetting" v-bind:entry.sync="entry"></setting-item>
        </ul>
    </mdl-cardpage>
</template>
<script>
    import SettingItem from '../components/setting-item.vue'
    
    export default {
        props: ['customList', 'appSetting', 'tempVars'],
        components: {
            SettingItem: SettingItem
        },
        data() {
            return {
                entrys: [
                    { title: "EPGにサムネを表示", id: "show_thumb_epg" },
                    { title: "EPGに詳細を表示", id: "show_details_epg" },
                    { title: "番組ページにサムネを表示", id: "show_thumb_details" },
                    /*{ title: "チャンネル名を画像で表示(黒テーマ注意)", id: "show_channel_image" }*/
                ]
            };
        },
        compiled(){
        },
        watch: {
            "entrys": {
                deep: true,
                handler(val, old) {
                    console.log(val, old);
                }
            }
        },
        methods: {
            test() {
                console.log(this.entrys);
            }
        }
    }
</script>
<style scoped>
    main {
        display: flex;
        justify-content: center;
        margin-top: 25px;
    }
</style>