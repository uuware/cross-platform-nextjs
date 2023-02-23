// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// const remote = require('electron').remote;

// window.addEventListener('DOMContentLoaded', () => {
//   const { ipcRenderer } = require('electron')

//   // send a command from frontend to backend
//   window.sendCommand = (arg) => {
//     var result = ipcRenderer.sendSync('synchronous-command', arg);
//     return result;
//   }
// })