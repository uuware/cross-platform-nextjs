const { app, ipcMain, dialog, Menu, BrowserWindow, session } = require('electron');
const { autoUpdater } = require('electron-updater');
const electronServe = require('electron-serve');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const log = require('electron-log');
autoUpdater.logger = log;

// Setup our web app loader, this lets us load apps like react, vue, and angular without changing their build chains.
const loadURL = electronServe({
  directory: path.join(__dirname, '../web-dir'),
});

// Set a CSP up for our application based on the custom scheme
function setupContentSecurityPolicy(customScheme) {
  // const filter = { urls: ['*://*.the-dominion-post-pwa-test.staging.nebula.stuff.co.nz/*', '*://*.onelogin.com/*'] };
  // session.defaultSession.webRequest.onHeadersReceived(filter, (details, callback) => {
  //   details.responseHeaders['Access-Control-Allow-Origin'] = ['*'];
  //   callback({ responseHeaders: details.responseHeaders });
  // });

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    details.responseHeaders['Access-Control-Allow-Origin'] = ['*'];
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        // 'Content-Security-Policy': [
        //   !app.isPackaged
        //     ? `default-src 'self' https://the-dominion-post-pwa-test.staging.nebula.stuff.co.nz https://the-dominion-post-pwa.production.nebula.stuff.co.nz http://192.168.1.76:4000/ http://localhost:4000/ http://127.0.0.1:4000/ https://stuff-adtech.s3.ap-southeast-2.amazonaws.com/ https://assets.adobedtm.com/ https://platform-admin-stage-media.staging.nebula-drupal.stuff.co.nz/ script-src 'self' 'unsafe-inline' devtools://* 'unsafe-eval' data:`
        //     : `default-src 'self' https://the-dominion-post-pwa-test.staging.nebula.stuff.co.nz https://the-dominion-post-pwa.production.nebula.stuff.co.nz http://192.168.1.76:4000/ http://localhost:4000/ http://127.0.0.1:4000/ https://stuff-adtech.s3.ap-southeast-2.amazonaws.com/ https://assets.adobedtm.com/ https://platform-admin-stage-media.staging.nebula-drupal.stuff.co.nz/ script-src 'self' 'unsafe-inline' devtools://* 'unsafe-eval' data:`,
        // ],
      },
    });
  });
}

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Update Ready',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new update is ready!',
  };
  dialog.showMessageBox(dialogOpts).then(returnValue => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
});

function createWindow() {
  // Load the previous state with fallback to defaults
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800,
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    // autoHideMenuBar: true,
    webPreferences: {
      // Use preload to inject the electron varriant overrides for capacitor plugins.
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      // enableRemoteModule: true,
    },
  });

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(mainWindow);

  // Security - Set Content-Security-Policy based on whether or not we are in dev mode.
  setupContentSecurityPolicy('self');

  // mainWindow.loadURL(`file://${__dirname}/../out/index.html#v${app.getVersion()}`);
  loadURL(mainWindow);
}
autoUpdater.on('update-available', info => {
  sendStatusToWindow('New update downloading...');
});
function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Setup the main manu bar at the top of our window.
  // Menu.setApplicationMenu(AppUtils.getMainMenu());

  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// // pass a command sent from frontend to backend
// ipcMain.on('synchronous-command', async (event, arg) => {
//   // AppUtils.ipcMainCommand(event, arg);
// });
