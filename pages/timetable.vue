<template>
    <main :class="['timetable', 'mdl-layout__content']" v-if="headers" v-el:container>
        <div>
            <div class="item header"
                :style="{ lineHeight: headerHeight + 'px', height: headerHeight + 'px', width: columnWidth + 'px', left: (header.left + timeWidth) + 'px' }"
                :style.sync="{ top: top + 'px' }"
                v-for="header in headers">
                <a v-link="header.link" v-if="header.link" v-text="header.title"></a>
                <span v-else v-text="header.title"></span>
            </div>
            <div class="item time"
                :style="{ height: minuteHeight * 60 + 'px', width: timeWidth + 'px', top: (time.top + headerHeight) + 'px' }"
                :style.sync="{ left: left + 'px' }"
                v-for="time in times" v-text="time.label">
            </div>
            <div class="item slot"
                :style="{ width: columnWidth + 'px', top: (piece.top + headerHeight) + 'px', left: (piece.left + timeWidth) + 'px', height: piece.height + 'px', minHeight: piece.height + 'px' }"
                :style.sync="{ background: piece.slot.startAt <= now && piece.slot.endAt >= now ? '#00ffaa' : (piece.slot.endAt <= now ? '#dfdfdf' : '#fff') }"
                @click="$route.router.go({ name: 'details', params: { channelId: piece.slot.channelId, slotId: piece.slot.id }})"
                v-for="piece in pieces">
                {{ piece.start }}
                <div class="name">
                    {{ piece.slot.title }}
                    <span class="mark" v-if="piece.slot.mark.first">初</span>
                    <span class="mark" v-if="piece.slot.mark.live">生</span>
                    <span class="mark" v-if="piece.slot.mark.last">終</span>
                </div>
                <div v-if="$setting.show_thumb_epg" class="thumb" :style="{ backgroundImage: 'url(//hayabusa.io/abema/programs/' + piece.slot.programs[0].id + '/' + piece.slot.programs[0].providedInfo.thumbImg + '.w280.h158.webp)' }"></div>
                <div class="description" v-show="$setting.show_details_epg" v-text="piece.slot.content"></div>
            </div>
            <div v-el:timeline class="timeline" :style.sync="{ top: (headerHeight + ((now - startTimestamp) / 60 * minuteHeight)) + 'px', width: (width - 10) + 'px' }">
                {{ nowLabel }}
            </div>
        </div>
    </main>
</template>
<script>
    import moment from 'moment'
    export default {
        props: ['customList'],
        data() {
            return {
                pieces: [],
                headers: [],
                times: [],
                minuteHeight: 2.5,
                columnWidth: 160,
                timeWidth: 40,
                headerHeight: 40,
                top: 0,
                left: 0,
                width: 0,
                now: 0,
                nowLabel: "",
                startTimestamp: 0,
                search: {}
            };
        },
        methods: {
            buildPieceChannel(media, channelId) {
                const ONE_DAY = 60 * 60 * 24;

                let channel = media.channels.filter(item => item.id == channelId);
                if (channel.length != 1) return Promise.reject();
                channel = channel[0];
                let times = [], headers = [], pieces = [];
                let maxTimestamp = Math.max.apply(null, media.programs.filter(item => item.channelId == channel.id).map(item => item.endAt));

                this.startTimestamp = this.today;

                let skipCount = 0;
                for (let day = this.today, i = 0; day < maxTimestamp; day += ONE_DAY, i++) {
                    console.log(day);
                    let programs = media.programs.filter(slot => {
                        return slot.channelId == channel.id && ((slot.endAt > day && slot.endAt < day + ONE_DAY) || (slot.startAt > day && slot.startAt < day + ONE_DAY));
                    });
                    if(programs.length <= 0) {
                        skipCount++;
                        continue;
                    }
                    headers.push({
                        title: moment(day * 1000).format('MM/DD(ddd)'),
                        left: (i - skipCount) * this.columnWidth
                    });
                    programs.forEach(slot => {
                        let startAt = slot.startAt < day ? day : slot.startAt;
                        let endAt = slot.endAt > day + ONE_DAY ? day + ONE_DAY : slot.endAt;
                        let top = (startAt - day) / 60 * this.minuteHeight;
                        if (top < 0) top = 0;
                        let height = (endAt - startAt) / 60 * this.minuteHeight;
                        pieces.push({
                            top: top,
                            height: height,
                            left: (i - skipCount) * this.columnWidth,
                            slot: slot,
                            start: moment(slot.startAt * 1000).format('HH:mm')
                        });
                    });
                }

                for (let i = 0; i < 24; i++) {
                    times.push({
                        top: i * this.minuteHeight * 60,
                        label: i.toString(10),
                        height: this.minuteHeight * 60
                    });
                }

                console.log("headers", headers);
                console.log("pieces", pieces);
                console.log("times", times);

                return { headers: headers, times: times, pieces: pieces };
            },
            buildPieceNormal(media) {
                let programs = media.programs.filter(slot => slot.startAt >= this.today);
                let times = [], headers = [], pieces = [];
                let channel = [];

                let minTimestamp = moment(Math.min.apply(null, programs.map(item => item.startAt)) * 1000).startOf('hour');
                let maxTimestamp = moment(Math.max.apply(null, programs.map(item => item.endAt)) * 1000).endOf('hour');
                console.log("min", minTimestamp.format('YYYY/MM/DD HH:mm'), "max", maxTimestamp.format('YYYY/MM/DD HH:mm'));

                this.startTimestamp = minTimestamp.unix();

                for (let time = minTimestamp, top = 0; time < maxTimestamp; time = time.add(1, 'hours'), top += this.minuteHeight * 60)
                    times.push({
                        top: top,
                        label: time.hour() == 0 ? time.format('MM/DD HH') : time.format('HH')
                    });

                minTimestamp = minTimestamp.unix();
                media.channels.forEach(item => {
                    if(this.search.channels && this.search.channels.indexOf(item.id) < 0) return;
                    let column = channel.push(item.id) - 1;
                    let left = this.columnWidth * column;

                    headers.push({
                        title: item.name.replace(/チャンネル$/, ""),
                        info: item.id,
                        link: { name: "channel", params: { channelId: item.id } },
                        left: left
                    });
                    programs.filter(slot => slot.channelId == item.id).forEach(slot => {
                        let top = (slot.startAt - this.startTimestamp) / 60 * this.minuteHeight;
                        if (top < 0) top = 0;
                        let height = (slot.endAt - slot.startAt) / 60 * this.minuteHeight;
                        pieces.push({
                            top: top,
                            height: height,
                            left: left,
                            slot: slot,
                            start: moment(slot.startAt * 1000).format('HH:mm')
                        });
                    });
                });
                console.log("headers", headers);
                console.log("pieces", pieces);
                console.log("times", times);

                return { headers: headers, times: times, pieces: pieces };
            },
            begin() {
                console.log(this);
                this.today = moment().startOf('day').unix();
                this.$timetable.then(media => {
                    if(this.$route.params.channelId) {
                        return this.buildPieceChannel(media, this.$route.params.channelId);
                    } else {
                        return this.buildPieceNormal(media);
                    }
                }).then(data => {
                    console.log("Paint");
                    ['headers', 'times'].forEach(key => {
                        this.$set(key, data[key]);
                    });
                    let timeWidth = this.timeWidth;
                    let headerHeight = this.headerHeight;
                    let el = this.$container = this.$els.container;
                    this.draw = () => {
                        let top = el.scrollTop - 200;
                        this.top = el.scrollTop;
                        let left = el.scrollLeft - 200;
                        this.left = el.scrollLeft;
                        this.width = el.scrollWidth;
                        let right = left + el.clientWidth + 400;
                        let bottom = top + el.clientHeight + 400;
                        let count = 0;
                        this.pieces = data.pieces.filter(item => {
                            if(item.node || (item.left + timeWidth > left && item.left + timeWidth < right
                                && (item.top + headerHeight > top || item.top + headerHeight + item.height > top)
                                && (item.top + headerHeight < bottom || item.top + headerHeight + item.height < bottom))){
                                    item.node = true;
                                    return true;
                                }
                            return false;
                        });
                        this.nowLabel = moment().format('HH:mm');
                        this.now = moment().unix();
                        if(this.pieces.length != data.pieces.length)
                            requestAnimationFrame(() => this.draw && this.draw());
                        else
                            console.log("completed");
                    }
                    this.$nextTick(() => {
                        let info = JSON.parse(this.$shared[`scroll_${this.$route.path}`] || "{}");
                        this.$container.scrollTop = info.top || 0;
                        this.$container.scrollLeft = info.left || 0;
                        console.log("Scroll applied", info);
                        this.draw();
                    });
                });
            }
        },
        compiled() {
            this.draw = null;
            if("custom" in this.$route.query){
                this.search = this.customList[this.$route.query.custom] ? this.customList[this.$route.query.custom].query : {};
            }
            this.begin();
        },
        watch: {
            "$route.params": {
                deep: true,
                handler() {
                    this.draw = null;
                    this.begin();
                }
            },
            "$route.query": {
                deep: true,
                handler() {
                    if("custom" in this.$route.query){
                        this.search = this.customList[this.$route.query.custom] ? this.customList[this.$route.query.custom].query : {};
                    }
                    this.draw = null;
                    this.begin();
                }
            }
        },
        route: {
            deactivate() {
                this.draw = null;
                this.$shared[`scroll_${this.$route.path}`] = JSON.stringify({
                    top: this.top || 0,
                    left: this.left || 0
                });
                return Promise.resolve();
            },
        },
        events: {
            scrollToNow() {
                if(this.$container)
                    this.$container.scrollTop = this.headerHeight + ((this.now - this.startTimestamp) / 60 * this.minuteHeight) - 200;
            }
        }
    }
</script>
<style scoped>
    main.timetable {
        overflow: scroll;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0;
        cursor: default;
    }
    
    main.timetable .item {
        position: absolute;
        border: 1px solid #bbb;
        background: #fff;
        overflow: hidden;
        box-sizing: border-box;
        z-index: 4;
    }
    
    main.timetable .item.header {
        text-align: center;
        z-index: 150;
    }
    
    main.timetable .item.time {
        text-align: center;
        z-index: 130;
    }
    
    main.timetable .item.slot {
        font-size: 12px;
    }
    
    main.timetable .item.slot:hover {
        height: unset !important;
        z-index: 100;
        box-shadow: 0 0 18px rgba(0, 0, 0, 0.6);
    }
    
    main.timetable .item.slot .name {
        font-size: 14px;
        display: inline-block;
        text-decoration: underline;
    }
    
    main.timetable .item.slot .name .mark {
        border: 1.5px solid #f00;
        border-radius: 2px;
        background: #f00;
        font-size: 10px;
        text-decoration: none;
    }
    
    main.timetable .item.slot div {
        font-size: 8px;
    }
    
    main.timetable .item.slot .thumb {
        min-height: 50px;
        width: 100px;
        background-repeat: no-repeat;
        background-size: cover;
        display: block;
    }

    main.timetable .timeline {
        background: rgba(255,0,0,0.3);
        left: 0;
        position: absolute;
        z-index: 140;
        color: rgba(255,0,0,0.3);
        height: 2px;
    }

</style>