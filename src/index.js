const {
  app,
  BrowserWindow,
  globalShortcut
} = require('electron');
const path = require('path');
require('dotenv').config();

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let win;

const createWindow = () => {

  win = new BrowserWindow({
    backgroundColor: '#FFFFFF',
    width: 1600,
    height: 900,
    fullscreen: true,
    frame: false,
    autoHideMenuBar: true,
    kiosk: true,
    show: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadURL(process.env.VSPOT_URL);

  win.once('ready-to-show', () => {
    const css = '* { cursor: none !important; }';
    win.webContents.insertCSS(css);
    win.show()
  })

  win.on('closed', () => {
    win = null;
  });

  globalShortcut.register('Escape', () => {
    app.quit();
  })

};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});