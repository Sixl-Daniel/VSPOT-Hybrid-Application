const {
  app,
  BrowserWindow,
  globalShortcut
} = require('electron');

const Store = require('electron-store');
const path = require('path');

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let win;

const store = new Store();
const fallbackUrl = 'https://vspot.eu/demo';

if (!store.has('url')) store.set('url', fallbackUrl);

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
    },
    icon: path.join(__dirname, '../assets/icons/png/1024x1024.png')
  });

  win.loadURL(store.get('url', fallbackUrl));

  win.once('ready-to-show', () => {
    const css = '* { cursor: none !important; }';
    win.webContents.insertCSS(css);
    win.show()
  })

  win.webContents.on('crashed', (e) => {
    app.relaunch();
    app.quit()
  });

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