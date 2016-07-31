<template>
	<div class="mdl-card mdl-shadow--2dp program-card">
	    <div class="mdl-card__title mdl-card--expand" v-bind:style="{ backgroundImage: appSetting.show_thumb_details ? 'url(//hayabusa.io/abema/programs/' + program.id + '/' + program.providedInfo.thumbImg + '.w280.h158.webp)' : '' }">
	        <h3 class="mdl-card__title-text">{{ program.episode.name || "" }} {{ program.episode.title }}</h3>
	    </div>
	    <div class="mdl-card__supporting-text" v-if="program.episode.title || program.episode.name">
	        <b>{{ program.episode.name || "" }} {{ program.episode.title }}</b> {{ program.episode.content }}
	    </div>
	</div>
</template>
<script>
    export default {
        props: ['program', 'appSetting']
    }
</script>
<style scoped>
    .mdl-card {
        position: relative;
    }

    .mdl-card > .mdl-card__title {
        background-repeat: no-repeat;
        background-size: cover;
    }

    .mdl-card > .mdl-card__title > .mdl-card__title-text {
        align-self: flex-start;
        color: #444;
        -webkit-text-stroke: .3px #fff;
    }

    .mdl-card > .mdl-card__supporting-text {
	    height: 1em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        background: rgba(255, 255, 255, 0.5);
        position: absolute;
        bottom: 0;
        width: 92%;
        transition: background .05s linear, height .05s linear;
    }

    .mdl-card:hover > .mdl-card__supporting-text {
        position: absolute;
        height: 80%;
        white-space: normal;
        text-overflow: ellipsis;
        overflow-x: hidden;
        overflow-y: auto;
        background: #fff;
    }
</style>

