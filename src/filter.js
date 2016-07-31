export default Vue => {
    Vue.filter('findSlot', (slots, search, slotKey) => {
        let keywords = (search.keyword || "").split(/ /).filter(str => str.length > 0);
        let mode = search.mode && search.mode == "and";
        let keys = search.mark || [];
        let marks = keys.filter(name => ['first', 'last', 'live'].indexOf(name) >= 0);
        let flags = keys.filter(name => ['timeshift', 'share', 'paused'].indexOf(name) >= 0);
        let titleOnly = (search.flag || []).indexOf('title') >= 0;
        let channels = search.channels || [];
        return slots.filter(item => {
            let slot = slotKey ? item[slotKey] || item : item;
            if(channels.length > 0 && channels.indexOf(slot.channelId) < 0) return false;
            if (keys.length > 0) {
                //Mark
                if (marks.find(name => !slot.mark[name]))
                    return false;

                //Flag
                if (flags.find(name => !slot.flag[name]))
                    return false;
            }
            if (keywords.length != 0) {
                let text = slot.title;
                if (!titleOnly) {
                    text += slot.content;
                    let casts = [], crews = [], copyrights = [];
                    slot.programs.forEach(item => {
                        (item.credit.casts || []).forEach(cast => casts.indexOf(cast) < 0 && casts.push(cast));
                        (item.credit.crews || []).forEach(crew => crews.indexOf(crew) < 0 && crews.push(crew));
                        (item.credit.copyrights || []).forEach(copyright => copyrights.indexOf(copyright) < 0 && copyrights.push(copyright));
                    });
                    text += casts.join("") + crews.join("") + copyrights.join("");
                }
                let matches = keywords.filter(keyword => {
                    return text.indexOf(keyword) >= 0;
                });
                if (mode ? matches.length != keywords.length : matches.length <= 0)
                    return false;
            }
            return true;
        });
    });
}