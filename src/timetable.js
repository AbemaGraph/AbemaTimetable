const Config = require('./config.js').default;
const moment = require('moment');
let fetchMediaData = () => {
    console.log("loading media...");
    return fetch(Config.timetableJsonUrl, { mode: 'cors' }).then(response => response.json());
}

let getMediaDataFile = () => {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem || null;
    if (!window.requestFileSystem) return Promise.reject();
    return Promise.resolve().then(() => {
        return new Promise((resolve, reject) => {
            window.requestFileSystem(window.TEMPORARY, 1024 * 1024 * 64, fs => resolve(fs), err => reject(err));
        });
    }).then(fs => {
        return new Promise((resolve, reject) => {
            fs.root.getFile(Config.timetableCacheName, { create: true }, entry => resolve(entry), err => reject(err));
        });
    });
}

let storeJsonData = (file, data) => {
    return Promise.resolve().then(() => {
        return new Promise((resolve, reject) => {
            file.createWriter(writer => resolve(writer), err => reject(err));
        });
    }).then(writer => {
        return new Promise((resolve, reject) => {
            writer.onwriteend = () => resolve(writer);
            writer.onerror = (e) => reject(e);
            writer.truncate(0);
        }).then(() => {
            return new Promise((resolve, reject) => {
                writer.onwriteend = () => resolve(writer);
                writer.onerror = (e) => reject(e);
                let blob = new Blob([JSON.stringify(data)], { encoding: 'UTF-8' });
                writer.write(blob);
            });
        });
    }).then(() => data);
}

let loadJsonData = (file) => {
    return Promise.resolve().then(() => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onloadend = (e) => resolve(JSON.parse(reader.result));
            reader.onerror = (e) => reject(e);
            reader.readAsText(file, 'UTF-8');
        });
    });
}

let getIndexedDB = () => {
    return new Promise((resolve, reject) => {
        if (!window.indexedDB) reject();
        let openRequest = window.indexedDB.open(Config.databaseName, 1);
        openRequest.addEventListener('upgradeneeded', e => {
            let db = openRequest.result;
            db.createObjectStore("cache", { keyPath: 'filename' });
        })
        openRequest.addEventListener('success', e => {
            resolve(openRequest.result);
        });
        openRequest.addEventListener('error', e => reject(e));
    });
};

let storeJsonDataToIDB = (db, file, data) => {
    let transaction = db.transaction(["cache"], IDBTransaction.READ_WRITE || 'readwrite');
    let store = transaction.objectStore("cache");
    return new Promise((resolve, reject) => {
        let getRequest = store.get(file);
        getRequest.addEventListener('error', e => reject(e));
        getRequest.addEventListener('success', e => e.target.result ? resolve(e) : reject());
    }).then(() => {
        return new Promise((resolve, reject) => {
            let putRequest = store.delete(file);
            putRequest.addEventListener('success', e => resolve(e));
            putRequest.addEventListener('error', e => reject(e));
            console.log("IDB: Deleting old cache");
        });
    }, () => null).then(() => {
        return new Promise((resolve, reject) => {
            let putRequest = store.put({
                filename: file,
                data: JSON.stringify(data),
                last: moment().unix()
            });
            putRequest.addEventListener('success', e => resolve(e));
            putRequest.addEventListener('error', e => reject(e));
            console.log("IDB: Stored new cache");
        });
    }).catch(e => Promise.reject(e));
};

let loadJsonDataFromIDB = (db, file, expire) => {
    return new Promise((resolve, reject) => {
        let transaction = db.transaction(["cache"], IDBTransaction.READ_WRITE || 'readwrite');
        let store = transaction.objectStore("cache");
        let getRequest = store.get(file);
        getRequest.addEventListener('error', e => reject(e));
        getRequest.addEventListener('success', e => {
            if (!getRequest.result) reject();
            let last = getRequest.result.last || 0;
            if (moment().unix() - last < expire)
                resolve(JSON.parse(getRequest.result.data));
            else
                reject();
        });
    });
}

export default {
    install(Vue) {
        console.log("Trying IDB");
        let _timetable = getIndexedDB().then(db => {
            return loadJsonDataFromIDB(db, Config.timetableCacheName, Config.cacheExpire).then(data => {
                console.log("Load from IDB");
                return data;
            }, () => {
                console.log("No cache [IDB]");
                return fetchMediaData().then(data => {
                    return storeJsonDataToIDB(db, Config.timetableCacheName, data).then(() => data);
                });
            });
        }, () => {
            console.log("Trying FSAPI");
            return getMediaDataFile().then(entry => {
                return new Promise((resolve, reject) => {
                    entry.file(file => {
                        console.log("size", file.size, "last", file.lastModified);
                        if (file.size > 0 && moment().unix() - moment(file.lastModified).unix() < Config.cacheExpire)
                            resolve(file);
                        else
                            reject(file);
                    }, err => reject(err));
                }).then(file => {
                    console.log("Load from FSAPI");
                    return loadJsonData(file);
                }, () => {
                    console.log("No cache [FSAPI]");
                    return fetchMediaData().then(json => {
                        return storeJsonData(entry, json);
                    });
                });
            }, () => {
                console.log("Unavailable cache");
                return fetchMediaData();
            });
        }).then(json => {
            let timetable = {
                channels: json.channels,
                programs: []
            };
            json.channelSchedules.forEach(item => {
                if (!item.hasOwnProperty("slots")) return;
                item.slots.forEach(slot => {
                    timetable.programs.push(slot);
                });
            });
            return timetable;
        });
        Vue.mixin({
            created() {
                this.$timetable = Promise.resolve(_timetable);
            }
        });
    }
}