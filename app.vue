<template>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header class="mdl-layout__header">
            <div class="mdl-layout__header-row">
                <span class="mdl-layout-title">AbemaTV Timetable</span>
                <div class="mdl-layout-spacer"></div>
                <nav class="mdl-navigation mdl-layout--large-screen-only">
                    <a class="mdl-navigation__link" @click="scrollToNow" href="#">NOW</a>
                </nav>
            </div>
        </header>
        <div class="mdl-layout__drawer">
            <span class="mdl-layout-title">Timetable</span>
            <nav class="mdl-navigation">
                <a class="mdl-navigation__link" @click="scrollToNow" href="#"><i class="material-icons">access_time</i> NOW</a>
                <a class="mdl-navigation__link" v-link="{ path: '/timetable' }"><i class="material-icons">border_all</i> ALL CHANNELS</a>
                <a class="mdl-navigation__link" v-link="{ path: '/list' }"><i class="material-icons">list</i> LIST</a>
                <a class="mdl-navigation__link" v-link="{ path: '/setting' }"><i class="material-icons">settings</i> SETTING</a>
                <a class="mdl-navigation__link" v-link="{ path: '/search' }"><i class="material-icons">search</i> SEARCH</a>
                <a class="mdl-navigation__link" v-link="{ path: '/customize' }"><i class="material-icons">playlist_add</i> CUSTOMIZE</a>
            </nav>
            <hr />
            <channel-menu :custom-list.sync="custom"></channel-menu>
        </div>
        <router-view :custom-list.sync="custom"></router-view>
        <div :class="{ 'mdl-layout__obfuscator': true, 'is-visible': load, 'loading': true }">
            <mdl-spinner></mdl-spinner>
        </div>
    </div>
</template>
<script>
    import ChannelMenu from './components/channel-menu.vue'
    export default {
        data() {
            return {
                load: true,
                custom: JSON.parse(localStorage.getItem('custom') || '[]') || []
            };
        },
        components: {
            ChannelMenu: ChannelMenu
        },
        compiled() {
            this.$timetable.then(media => {
                this.load = false;
            });
        },
        methods: {
            scrollToNow(e){
                e.preventDefault();
                this.$broadcast('scrollToNow');
            }
        },
        watch: {
            "custom": {
                deep: true,
                handler() {
                    localStorage.setItem('custom', JSON.stringify(this.custom));
                }
            }
        }
    }
</script>
<style>
    body {
        font-family: Arial, 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', 'メイリオ', 'Meiryo', 'ＭＳ Ｐゴシック';
    }

    .mdl-navigation__link.v-link-active:not(.no-select) {
        background: #ddd;
    }

    .mdl-layout__obfuscator.loading {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>