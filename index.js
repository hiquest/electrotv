/* global require, __dirname, process */
const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

let win; // global, as to protect from GC

app.on('ready', createWindow);
app.on('window-all-closed', onAllClosed);
app.on('activate', onActivated);

function createWindow () {
  win = new BrowserWindow({width: 1080, height: 600});

  loadPage();

  // release the pointer for the GC
  win.on('closed', () => win = null);
}

function loadPage() {
  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, './src/index.html'),
    protocol: 'file:',
    slashes: true
  }));
}

function onAllClosed() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}

function onActivated() {
  if (win === null) {
    createWindow();
  }
}
