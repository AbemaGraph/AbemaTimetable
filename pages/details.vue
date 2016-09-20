<template>
    <main class="mdl-layout__content">
        <div class="mdl-card mdl-shadow--16dp" v-if="slot">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text">
                    <span class="mark" v-if="slot.mark.bingeWatching">一挙</span>
                    <span class="mark" v-if="slot.mark.first">初</span>
                    <span class="mark" v-if="slot.mark.live">生</span>
                    {{ slot.title }}
                    <span class="mark" v-if="slot.mark.last">終</span>
                </h2>
                <p class="mdl-card__subtitle-text">
                    <i>{{ date }}</i>
                    <i v-if="!slot.flag.timeshift">タイムシフトなし</i>
                </p>
                <div class="mdl-card__title-button">
                    <mdl-button raised colored v-mdl-ripple-effect @click="openNowOnAir(slot.channelId)"><i class="material-icons">play_circle_filled</i> 視聴ページ</mdl-button>
                    <mdl-button v-mdl-ripple-effect @click="openDetailsOfficial(slot.channelId, slot.id)">公式での詳細</mdl-button>
                </div>
            </div>
            <div class="mdl-card__supporting-text" id="description" v-text="slot.content"></div>
            <hr v-if="thumbs.length && appSetting.show_thumb_details" />
            <div class="thumbs" v-if="thumbs.length && appSetting.show_thumb_details">
                <div class="mdl-shadow--4dp" :style="{ 'backgroundImage': 'url(' + thumb + ')' }" v-for="thumb in thumbs"></div>
            </div>
            <hr />
            <div class="card-box credit">
                <div class="mdl-card mdl-shadow--4dp" v-if="casts">
                    <div class="mdl-card__title">
                        <h3 class="mdl-card__title-text"><i class="material-icons">record_voice_over</i></h3>
                    </div>
                    <hr>
                    <ul class="mdl-list">
                        <li class="mdl-list__item" v-for="cast in casts">
                            <span class="mdl-list__item-primary-content" v-text="cast"></span>
                        </li>
                    </ul>
                </div>
                <div class="mdl-card mdl-shadow--4dp" v-if="crews">
                    <div class="mdl-card__title">
                        <h3 class="mdl-card__title-text"><i class="material-icons">people</i></h3>
                    </div>
                    <hr>
                    <ul class="mdl-list">
                        <li class="mdl-list__item" v-for="crew in crews">
                            <span class="mdl-list__item-primary-content" v-text="crew"></span>
                        </li>
                    </ul>
                </div>
            </div>
            <hr v-if="slot.programs.length" />
            <div class="card-box slot-programs" v-if="slot.programs.length">
                <program-card :app-setting.sync="appSetting" v-for="program in slot.programs" :program="program"></program-card>
            </div>
            <hr />
            <center v-for="copyright in copyrights" v-text="copyright"></center>
        </div>
        <mdl-cardpage title="見つかりません" width="75" v-if="notfound">
            <div class="mdl-card__supporting-text">
                <p>番組が見つかりませんでした。</p>
            </div>
        </mdl-cardpage>
    </main>
</template>
<script>
    import ProgramCard from '../components/program-card.vue'
    import moment from 'moment'
    export default {
        props: ['customList', 'appSetting', 'tempVars'],
        components: {
            ProgramCard: ProgramCard
        },
        data() {
            return {
                casts: [],
                crews: [],
                copyrights: [],
                thumbs: [],
                date: "",
                slot: null
            };
        },
        compiled() {
            let channelId = this.$route.params.channelId;
            let slotId = this.$route.params.slotId;
            this.$timetable.then(data => {
                let slot = data.programs.find(item => item.channelId == channelId && item.id == slotId);
                if(!slot) {
                    this.$set("notfound", true);
                    return;
                }
                console.log(JSON.stringify(slot));
                let casts = [], crews = [], copyrights = [], thumbs = [];
                slot.programs.forEach(item => {
                    item.providedInfo && item.providedInfo.sceneThumbImgs && item.providedInfo.sceneThumbImgs.forEach(thumb => {
                        let img = `//hayabusa.io/abema/programs/${item.id}/${thumb}.w200.h114.webp`;
                        thumbs.indexOf(img) < 0 && thumbs.push(img);
                    });
                    item.credit.casts && item.credit.casts.forEach(cast => casts.indexOf(cast) < 0 && casts.push(cast));
                    item.credit.crews && item.credit.crews.forEach(crew => crews.indexOf(crew) < 0 && crews.push(crew));
                    item.credit.copyrights && item.credit.copyrights.forEach(copyright => copyrights.indexOf(copyright) < 0 && copyrights.push(copyright));
                });
                this.$set("slot", slot);
                this.$set("casts", casts);
                this.$set("crews", crews);
                this.$set("thumbs", thumbs);
                this.$set("copyrights", copyrights);
                this.$set("date", `${moment(slot.startAt * 1000).format('YYYY/MM/DD(ddd) HH:mm')} - ${moment(slot.endAt * 1000).format('MM/DD HH:mm')}`);
            });
        },
        methods: {
            openNowOnAir(channelId) {
                window.open(`https://abema.tv/now-on-air/${channelId}`, '_blank');
            },
            openDetailsOfficial(channelId, slotId) {
                window.open(`https://abema.tv/channels/${channelId}/slots/${slotId}`, '_blank');
            }
        }
    }
</script>
<style scoped>
    main {
        padding: 20px 10px 0 10px;
    }
    
    .mdl-button--fab {
        position: fixed;
        right: 25px;
        bottom: 25px;
        z-index: 20;
    }
    
    main > .mdl-card {
        width: 100%;
        padding-bottom: 30px;
    }
    
    main .mdl-card__title {
        flex-direction: column;
    }

    main .mdl-card__subtitle-text, main .mdl-card__title-text, main .mdl-card__title-button {
        align-self: flex-start;
    }

    .card-box {
        padding: 0 8px;
        display: flex;
        flex-wrap: wrap;
    }
    
    .card-box > .mdl-card {
        margin: 8px;
    }
    
    .credit hr {
        margin: 3px 0;
    }
    
    .credit .mdl-card__title {
        padding: 8px 16px;
    }
    
    .credit .mdl-list {
        margin: 0;
    }
    
    .credit .mdl-list__item {
        margin: 3px 0;
        padding: 5px 16px;
        min-height: unset;
    }
    
    .thumbs {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .thumbs > div {
        width: 200px;
        min-width: 200px;
        background-repeat: no-repeat;
        background-size: cover;
        height: 120px;
        min-height: 120px;
        margin: 8px;
        border-radius: .8px;
    }

    .mark {
        color: #fff;
        font-size: 15px;
        border: 1.5px solid #f00;
        border-radius: 2px;
        background: rgba(255, 0, 0, 0.5);
        text-decoration: none;
        height: 18px;
        line-height: 18px;
    }
</style>