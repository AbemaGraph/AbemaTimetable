<template>
    <li :class="['mdl-list__item']">
        <span :class="['mdl-list__item-primary-content']">{{ entry.title }}</span>
        <span :class="['mdl-list__item-secondary-action']">
	        <mdl-switch :class="['mdl-js-ripple-effect']" :checked.sync="$setting[entry.id]"></mdl-switch>
	    </span>
    </li>
</template>
<script>
    export default {
        props: ['entry'],
        data() {
            return {
                enable: $setting[this.entry.id] || false
            };
        },
        watch: {
            enable() {
                this.$setting[this.entry.id] = this.enable;
            }
        }
    }
</script>