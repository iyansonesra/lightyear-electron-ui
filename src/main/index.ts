import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
// const { ipcMain } = require('electron');
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

// async function testServerAccess() {
//   try {
//     const url = 'https://token-server-jfekb4jwga-uc.a.run.app';
//     const res = await axios.get(url);
//     console.log("yooo");
//     console.log('Response data:', res.data);
//     console.log('Response status:', res.status);
//     console.log('Response headers:', res.headers);
//   } catch (error) {
//     console.error('Error accessing the server:', error.message);
//     if (error.response) {
//       console.error('Response status:', error.response.status);
//       console.error('Response data:', error.response.data);
//     }
//   }
// }


// const auth = new GoogleAuth({
//   keyFile: path.join(__dirname, './../../ly-machine-auth-ec69815bb255.json'),
//   scopes: ['https://www.googleapis.com/auth/cloud-platform'],
// });

// ipcMain.handle('test-server-access', async (event) => {
//   return testServerAccess();
// });


// ipcMain.handle('get-custom-token', async (event, apiKey) => {
//   try {
//     const client = await auth.getClient();
//     const url = 'https://token-server-jfekb4jwga-uc.a.run.app';
//     const res = await client.request({
//       url,
//       method: 'POST',
//       data: { apiKey },
//     });
//     return res.data.token;
//   } catch (error) {
//     console.error('Error getting custom token:', error.response ? error.response.data : error);
//     throw error;
//   }
// });

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true,
    
    }
  })


  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()
  testServerAccess(); 

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
