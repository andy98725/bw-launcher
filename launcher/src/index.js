const { app, BrowserWindow } = require('electron');
const { ipcMain } = require('electron')

const path = require('path');

const { setData } = require('./website.js');
const { autostart } = require('./gameState.js');
const { launchGame } = require('./files.js');
const { pollWebsite } = require('./preloader.js');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}


function createWindow(data) {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, './render/index.html'), { query: { "data": JSON.stringify(data) } });


  // // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

let infoCache = {};
function start() {
  pollWebsite().then((onlineInfo) => {
    infoCache = onlineInfo;
    setData(onlineInfo);

    if (autostart())
      launchGame();
    else
      createWindow(onlineInfo);
  });

}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', start);

ipcMain.on('game-launch', (evt, arg) => {
  app.quit()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow(infoCache);
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
