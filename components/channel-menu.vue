<template>
    <nav class="mdl-navigation">
        <a class="mdl-navigation__link no-select" v-for="(id, custom) in customList" v-link="{ path: '/' + (custom.mode == 'timetable' ? 'timetable': 'list'), query: { custom: id } }">{{ custom.name }}</a>
    </nav>
    <hr />
    <nav class="mdl-navigation">
        <a class="mdl-navigation__link" v-for="channel in channels | orderBy 'order'" v-link="{ name: 'channel', params: { channelId: channel.id } }">{{ channel.name }}</a>
    </nav>
</template>
<script>
    export default {
        props: ['customList'],
        data() {
            return {
                channels: []
            };
        },
        compiled() {
            this.$timetable.then(media => this.channels = media.channels.map(item => {
                return { name: item.name.replace(/チャンネル$/, ""), id: item.id, order: item.order }
            }));
        }
    }
</script>