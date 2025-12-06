//
// script.js
//


//
// Class.
//
class I18nJson {

    static IsLoading     = false;
    static LsKeyPrefix   = 'I18n.';
    static LsKeyDate     = 'I18n.date';
    static LsExpiresDate = 3;
    static SleepMS       = 300;
    static SleepCnt      = 5;
    static Strings       = {};

    //
    // Load.
    // @param
    //     langCodeUrlMapList: array:
    //         [
    //             {
    //                 langCode: 'en',
    //                 url: '/i18n/en.json'
    //             },
    //             {
    //                 langCode: 'ja',
    //                 url: '/i18n/ja.json'
    //             }
    //         ]
    //     timestamp: string: 2022102356012
    // @usage
    //     await I18nJson.Load([{langCode: 'en', url: '/i18n/en.json'}]);
    //     const localizedString = I18nJson.String('en', 'json.key');
    //
    static async Load(langCodeUrlMapList, timestamp = null) {
        // Check if it has been loading JSON file or not.
        await I18nJson.queuing();

        // Check if it has been loaded in the local storage or not
        const lsValDateStr = window.localStorage.getItem(I18nJson.LsKeyDate);
        if(lsValDateStr) {
            const lsValDate = new Date(lsValDateStr);
            const now = new Date();
            if((timestamp !== null && timestamp === lsValDateStr) || now.getTime() < lsValDate.getTime()) {
                for(let i = 0; i < langCodeUrlMapList.length; i++) {
                    const { langCode } = langCodeUrlMapList[i];
                    const s = window.localStorage.getItem(`${I18nJson.LsKeyPrefix}${langCode}`);
                    if(s === undefined || s === null) { continue }
                    try {
                        I18nJson.Strings[langCode] = JSON.parse(s);
                    } catch(e) {
                        console.error(`[I18nJson] invalid JSON in localStorage: lang_code=${langCode} error="${e}"`);
                    }
                }
                I18nJson.IsLoading = false;
                return true;
            }
        }

        // HTTP GET request
        try {
            for(let i = 0; i < langCodeUrlMapList.length; i++) {
                const { langCode, url } = langCodeUrlMapList[i];
                await I18nJson.getRequest(langCode, url, timestamp);
            }
        } catch(err) {
            console.error(`[I18nJson] failed to send request: error="${err}"`);
        } finally {
            I18nJson.IsLoading = false;
        }
    }


    //
    // Get localized string.
    //
    static String(langCode, key, defaultVal = key) {
        if(!I18nJson.Strings[langCode]) {
            return defaultVal;
        }
        const keys = key.split('.');
        let value;
        for(let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if(i === 0) {
                if(I18nJson.Strings[langCode][k] == null || I18nJson.Strings[langCode][k] === '') {
                    return defaultVal;
                } else {
                    value = I18nJson.Strings[langCode][k];
                }
            } else {
                if(value[k] == null || value[k] === '') {
                    return defaultVal;
                } else {
                    value = value[k];
                }
            }
        }
        return value;
    }


    //
    // HTTP GET request.
    //
    static getRequest(langCode, url, timestamp) {
        return new Promise((resolve, reject) => {
            let lsDateVal;
            if(timestamp !== null) {
                lsDateVal = timestamp.toString();
            } else {
                const val = new Date();
                val.setDate(val.getDate() + I18nJson.LsExpiresDate);
                lsDateVal = val.toString();
            }
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = () => {
                if(xhr.status >= 200 && xhr.status < 300) {
                    const resJson = JSON.parse(xhr.responseText);
                    if(resJson !== undefined && resJson !== null) {
                        I18nJson.Strings[langCode] = resJson;
                        window.localStorage.setItem(`${I18nJson.LsKeyPrefix}${langCode}`, JSON.stringify(resJson));
                        window.localStorage.setItem(I18nJson.LsKeyDate, lsDateVal);
                        resolve();
                    } else {
                        reject('Invalid a json file. url: ' + url);
                    }
                } else {
                    reject(xhr.status + ' ' + xhr.statusText);
                }
            };
            xhr.onerror = () => reject(xhr.status + ' ' + xhr.statusText);
            xhr.send();
        });
    }


    //
    // Queuing.
    //
    static async queuing() {
        if(I18nJson.IsLoading) {
            for(let i = 0; i < I18nJson.SleepCnt; i++) {
                await new Promise(resolve => setTimeout(resolve, I18nJson.SleepMS));
                if(!I18nJson.IsLoading) { break }
            }
        } else {
            I18nJson.IsLoading = true;
        }
    }


}
export { I18nJson };
