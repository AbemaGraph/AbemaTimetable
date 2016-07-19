const SETTING_ITEMS = ['show_thumb_epg', 'show_details_epg', 'show_thumb_details'];
export default Vue => {
    let setting = JSON.parse(localStorage.getItem('setting') || '{}');
    global.$setting = {};
    SETTING_ITEMS.forEach(key => {
        Object.defineProperty(global.$setting, key, {
            enumerable: true,
            set(value) {
                setting[key] = value;
                localStorage.setItem('setting', JSON.stringify(setting));
                console.log("Commited");
            },
            get() {
                return !!setting[key];
            }
        });
    });
    global.$shared = {};
    Vue.mixin({
        created() {
            this.$setting = global.$setting;
            this.$shared = global.$shared;
        }
    });
}