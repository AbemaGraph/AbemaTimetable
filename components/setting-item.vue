<template>
    <li class="mdl-list__item">
        <span class="mdl-list__item-primary-content">{{ entry.title }}</span>
        <span class="mdl-list__item-secondary-action">
	        <mdl-switch class="mdl-js-ripple-effect" :checked.sync="appSetting[entry.id]"></mdl-switch>
	    </span>
    </li>
</template>
<script>
    export default {
        props: ['entry', 'appSetting'],
        data() {
            return {
                enable: this.appSetting[this.entry.id] || false
            };
        },
        watch: {
            enable() {
                this.appSetting[this.entry.id] = this.enable;
            }
        }
    }
</script>