<template>
    <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header class="mdl-layout__header">
            <div class="mdl-layout__header-row">
                <span class="mdl-layout-title">AbemaTV Timetable</span>
                <div class="mdl-layout-spacer"></div>
                <nav class="mdl-navigation mdl-layout--large-screen-only">
                    <a class="mdl-navigation__link" @click="scrollToNow" href="#">NOW</a>
                </nav>
                <button id="menu" class="mdl-button mdl-js-button mdl-button--icon">
	                <i class="material-icons">more_vert</i>
                </button>
                <ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" data-mdl-for="menu">
	                <li @click="scrollToNow" class="mdl-menu__item">NOW</li>
                    <li class="mdl-menu__item--full-bleed-divider"></li>
	                <li v-for="date in dates" class="mdl-menu__item" v-text="date" @click="scrollToDate(date)"></li>
                </ul>
            </div>
        </header>
        <div class="mdl-layout__drawer" >
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
            <channel-menu :custom-list.sync="custom" ></channel-menu>
            <hr />
            <nav class="mdl-navigation">
                <a class="mdl-navigation__link" v-link="{ path: '/info' }"><i class="material-icons">info</i> ABOUT</a>
            </nav>
        </div>
        <router-view :custom-list.sync="custom" :app-setting.sync="setting" :temp-vars.sync="tempVars" ></router-view>
        <div class="mdl-layout__obfuscator loading" :class="{ 'is-visible': load }">
            <mdl-spinner></mdl-spinner>
        </div>
    </div>
</template>
<script>
    import ChannelMenu from './components/channel-menu.vue'
    import moment from 'moment'
    export default {
        data() {
            return {
                load: true,
                custom: JSON.parse(localStorage.getItem('custom') || '[]') || [],
                setting: Object.assign({
                    show_details_epg: false,
                    show_thumb_epg: false,
                    show_thumb_details: true,
                    show_channel_image: true
                }, JSON.parse(localStorage.getItem('setting') || '{}') || {}),
                tempVars: {},
                dates: []
            };
        },
        components: {
            ChannelMenu: ChannelMenu
        },
        compiled() {
            this.$timetable.then(media => {
                this.load = false;
                this.dates = [];
                let now = moment().unix();
                media.programs.filter(slot => slot.startAt > now).forEach(slot => {
                    let label = moment(slot.startAt * 1000).format('YYYY/MM/DD(ddd)');
                    this.dates.indexOf(label) < 0 && this.dates.push(label);
                });
            });
        },
        methods: {
            scrollToNow(e) {
                this.$broadcast('scrollToNow');
            },
            scrollToDate(str) {
                let date = moment(str, 'YYYY/MM/DD(ddd)').unix();
                this.$broadcast('scrollToDate', date);
            }
        },
        watch: {
            "custom": {
                deep: true,
                handler() {
                    localStorage.setItem('custom', JSON.stringify(this.custom));
                }
            },
            "setting": {
                deep: true,
                handler() {
                    localStorage.setItem('setting', JSON.stringify(this.setting));
                }
            }
        }
    }
</script>
<style>
    body {
        font-family: Arial, 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', 'メイリオ', 'Meiryo', 'ＭＳ Ｐゴシック';
        
    }

    .mdl-layout {
        overflow: hidden;
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