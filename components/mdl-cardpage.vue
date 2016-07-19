<template>
    <main class="mdl-layout__content" >
        <div class="mdl-card mdl-shadow--2dp" v-bind:style="{ width: width + '%' || '50%' }">
            <div class="mdl-card__title" v-if="title">
                <h2 class="mdl-card__title-text" v-text="title"></h2>
            </div>
            <slot></slot>
        </div>
    </main>
</template>
<script>
    export default {
        props: ['width', 'title']
    }
</script>
<style scoped>
    main {
        display: flex;
        justify-content: center;
        margin-top: 25px;
    }
</style>