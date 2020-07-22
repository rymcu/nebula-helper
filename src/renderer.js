// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const SerialPort = require('serialport')
SerialPort.list().then(
    ports => ports.forEach(console.log),
    err => console.error(err)
)
