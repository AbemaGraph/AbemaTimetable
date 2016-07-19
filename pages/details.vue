<template>
    <main class="mdl-layout__content">
        <div class="mdl-card mdl-shadow--16dp" v-if="slot">
            <div class="mdl-card__title">
                <h2 class="mdl-card__title-text" v-text="slot.title"></h2>
                <p class="mdl-card__subtitle-text">
                    <i v-text="date"></i>
                </p>
                <div class="mdl-card__title-button">
                    <mdl-button raised colored v-mdl-ripple-effect @click="openNowOnAir(slot.channelId)"><i class="material-icons">play_circle_filled</i> 視聴ページ</mdl-button>
                    <mdl-button v-mdl-ripple-effect @click="openDetailsOfficial(slot.channelId, slot.id)">公式での詳細</mdl-button>
                </div>
            </div>
            <div class="mdl-card__supporting-text" id="description" v-text="slot.content"></div>
            <hr>
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
                <program-card v-for="program in slot.programs" :program="program"></program-card>
            </div>
            <hr />
            <center v-text="copyrights[0] || ''"></center>
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
        components: {
            ProgramCard: ProgramCard
        },
        data() {
            return {
                casts: [],
                crews: [],
                copyrights: [],
                date: "",
                slot: null
            };
        },
        compiled() {
            let channelId = this.$route.params.channelId;
            let slotId = this.$route.params.slotId;
            this.$timetable.then(data => {
                let slots = data.programs.filter(item => item.channelId == channelId && item.id == slotId);
                if(slots.length != 1) {
                    this.$set("notfound", true);
                    return;
                }
                let slot = slots[0];
                console.log(JSON.stringify(slot));
                let casts = [], crews = [], copyrights = [];
                slot.programs.forEach(item => {
                    (item.credit.casts || []).forEach(cast => casts.indexOf(cast) < 0 &&casts.push(cast));
                    (item.credit.crews || []).forEach(crew => crews.indexOf(crew) < 0 && crews.push(crew));
                    (item.credit.copyrights || []).forEach(copyright => copyrights.indexOf(copyright) < 0 && copyrights.push(copyright));
                });
                this.$set("slot", slot);
                this.$set("casts", casts);
                this.$set("crews", crews);
                this.$set("copyrights", copyrights);
                this.$set("date", `${moment(slot.startAt * 1000).format('YYYY/MM/DD HH:mm:ss')} - ${moment(slot.endAt * 1000).format('MM/DD HH:mm:ss')}`);
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
</style>