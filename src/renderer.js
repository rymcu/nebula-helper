// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
window.electron = require('electron')

try {
    const iconv = require('iconv-lite');
    window.iconv = iconv
    const log = require('electron-log')
    console.log = log.log
} catch (e) {
    console.log(e)
}