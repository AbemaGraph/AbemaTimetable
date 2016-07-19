const Vue = global.Vue = require('vue');
const VueRouter = require('vue-router');
const VueMdl = require('vue-mdl').default;
const MdlCardpage = require('../components/mdl-cardpage.vue');
const Timetable = require('./timetable.js').default;
const Setting = require('./setting.js').default;
const Filter = require('./filter.js').default;
//const Custom = require('./custom.js').default;

require('material-design-lite/material.js');
require('material-design-lite/material.css');
require('moment/locale/ja');
Vue.use(VueRouter);
Vue.use(VueMdl);
Vue.use(Timetable);
Vue.use(Setting);
Vue.use(Filter);
//Vue.use(Custom);
Vue.component("MdlCardpage", MdlCardpage);

const router = new VueRouter({ history: true, saveScrollPosition: true });

router.redirect({
    '/': '/timetable',
    '/channel/:channelId': '/timetable/channel/:channelId'
});

router.map({
    '/': {
        component: require('../pages/timetable.vue'),

    },
    '/timetable': {
        component: require('../pages/timetable.vue')
    },
    '/timetable/channel/:channelId': {
        name: "channel",
        component: require('../pages/timetable.vue')
    },

    '/list': {
        component: require('../pages/list.vue')
    },

    '/list/channel/:channelId': {
        component: require('../pages/list.vue')
    },

    '/search': {
        component: require('../pages/search.vue')
    },

    '/channel/:channelId/slot/:slotId': {
        name: "details",
        component: require('../pages/details.vue')
    },

    '/setting': {
        component: require('../pages/setting.vue')
    },

    '/customize': {
        component: require('../pages/customize.vue')
    },
    '/customize/add': {
        component: require('../pages/customize/add.vue')
    },
    '/customize/edit/:id': {
        component: require('../pages/customize/edit.vue')
    },
    
    '*': {
        component: require('../pages/notfound.vue')
    }
});

const app = Vue.extend(require('../app.vue'));
router.start(app, '#app');