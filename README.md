#MWBot
## Description
MWBot is a Node.js NPM module for interacting with the MediaWiki API.
It uses Promises and is written using modern ES6.
The design goal is to be as flexible as possible, with the ability to overwrite any option at any point.
The library also lets you choose the abstraction/convenience level on which you want to work.

## Requirements
* Node.js 4.0+

## API Documentation
* [API Documenatation](API.md)

## Examples
### Single Requests, chained with .then
```js
const MWBot = require('mwbot');

let bot = new MWBot();

bot.loginGetEditToken(loginCredentials.valid).then(() => {
    return bot.edit('Test Page', '=Some more Wikitext=', 'Test Upload');
}).then((response) => {
    // Success
}).catch((err) => {
    // Error
});
```
### Batch Request
```js
bot.loginGetEditToken(loginCredentials.valid).then(() => {
    return bot.batch({
        create: {
            'TestPage1': 'TestContent1',
            'TestPage2': 'TestContent2'
        },
        update: {
            'TestPage1': 'TestContent1-Update'
        },
        delete: [
            'TestPage2'
        ],
        edit: {
            'TestPage2': 'TestContent2',
            'TestPage3': Math.random()
        },
        upload: {
            'Image1.png': '/path/to/Image1.png'
        }
    }, 'Batch Upload Reason');

}).then((response) => {
    // Success
}).catch((err) => {
    // Error
});
```

For more examples please take a look at the /test/ directory