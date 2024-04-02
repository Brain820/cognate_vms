import path from 'path';
import { app, BrowserWindow, shell, ipcMain, Menu, globalShortcut, session} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { resolveHtmlPath } from './util';
const isDev = require('electron-is-dev');
app.commandLine.appendSwitch('ignore-gpu-blacklist');
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.disableHardwareAcceleration();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}


let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = false;

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    // show: false,
    width: 1920,
    height: 1080,
    frame: false,
    fullscreen: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      offscreen: false,
      // devTools: false,
      devTools: isDev
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.webContents.once('did-finish-load', () => {
  mainWindow.show();
  });
  // globalShortcut.register('Escape', () => {
  //   toggleFrameAndFullScreen();
  // });

  const customMenu = Menu.buildFromTemplate([])
  Menu.setApplicationMenu(customMenu)

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
  new AppUpdater();
  mainWindow.webContents.openDevTools();
};

function toggleFrameAndFullScreen() {
  const isFullScreen = mainWindow.isFullScreen();

  // Toggle frame
  mainWindow.setFullScreen(!isFullScreen);

  // Toggle full-screen mode
  mainWindow.setFullScreen(!isFullScreen);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('will-quit', () => {
  globalShortcut.unregisterAll();

});

app
  .whenReady()
  .then(() => {
    createWindow();
    // globalShortcut.register('F11', () => {
    //   mainWindow.setFullScreen(!mainWindow.isFullScreen());
    // });
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

