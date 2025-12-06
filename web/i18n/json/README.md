# i18n for JSON


## Installation

```console
npm i @k4k3ru/i18n-json
```


## Usage

1. Create localized JSON files

en.json:
```json
{
	"dictionary": {
		"login": "Login"
	}
}
```

ja.json:
```json
{
    "dictionary": {
        "login": "ログイン"
    }
}
```

2. Import the package.

```javascript
import { I18nJson } from 'YOUR_PROJECT_PATH/node_modules/@k4k3ru/i18n-json/dist/script.js';
```

3. Initialize the class.

```javascript
const locales = [{
    langCode: 'en',
    url: '/i18n/en.json'
},{
    langCode: 'ja',
    url: '/i18n/ja.json'
}]

await I18nJson.Load(ConfigI18n.Map);
```

4. Get the localized value.

```javascript
const loginTxt = I18nJson.String('ja', 'dictionary.login');
// loginTxt = 'ログイン';
```


## Support me
I am a Japanese developer, and your support is a great encouragement for my work!
In addition to support, feel free to reach out with comments, feature requests, or development inquiries!

Thank you for your support😊

[![Support on Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20Me-blue?style=flat-square&logo=ko-fi)](https://ko-fi.com/k4k3ru)


## License
This repository is open-source and distributed under the MIT License.
