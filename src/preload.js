// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const log = require('electron-log')
console.log = log.log
log.info('Hello, log');