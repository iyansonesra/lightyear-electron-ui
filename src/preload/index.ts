const { contextBridge, ipcRenderer } = require('electron');
import { electronAPI } from '@electron-toolkit/preload'
import { SerialPort, ReadlineParser } from 'serialport';
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');
const path = require('path');

// Custom APIs for renderer
const api = {}

console.log('resetting port');

// const auth = new GoogleAuth({
//   keyFile: path.join(__dirname, '../../ly-machine-auth-ec69815bb255.json'),
//   scopes: ['https://www.googleapis.com/auth/cloud-platform'],
// });

// async function getCustomToken (apiKey) {
//   const client = await auth.getClient();
//   const url = 'https://token-server-jfekb4jwga-uc.a.run.app/getCustomToken';
//   const res = await client.request({
//     url,
//     method: 'POST',
//     data: { apiKey },
//   });
//   return res.data.token;
// }

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)

    // contextBridge.exposeInMainWorld('api', {
    //   getCustomToken: (apiKey) => ipcRenderer.invoke('get-custom-token', apiKey),
    //   testServerAccess: () => ipcRenderer.invoke('test-server-access')
    // });
    
    const openPorts = {};
    const angleListeners = {};

    contextBridge.exposeInMainWorld('serialport', {
      list: () => {
        return new Promise<string[]>(async (resolve) => {
          const ports = await SerialPort.list();
          const paths = ports.map((port) => port.path);
          resolve(paths);
        });
      },
    
      reset: (path: string) => {
        return new Promise<void>((resolve, reject) => {
          const port = new SerialPort({ path, baudRate: 9600, autoOpen: true });
          console.log('resetting port', path);
          port.open((error) => {
            port.close(() => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          });
        });
      },
    
      openPort: (path: string, baudRate: number) => {
        return new Promise<void>((resolve, reject) => {
          const port = new SerialPort({ path, baudRate, autoOpen: false });
          const parser = new ReadlineParser();
    
          port.pipe(parser);
    
          parser.on('data', (line) => {
            console.log(line);
            if (angleListeners[path]) {
              const angle = parseFloat(line);
              if (!isNaN(angle)) {
                angleListeners[path](angle);
              }
            }
          });
    
          port.open((error) => {
            if (error) {
              reject(error);
            } else {
              openPorts[path] = port;
              resolve();
            }
          });
        });
      },
    
      writeToPort: (path: string, dataToWrite: string) => {
        return new Promise<void>((resolve, reject) => {
          const port = openPorts[path];
          if (!port || !port.isOpen) {
            reject(new Error(`Port ${path} is not open`));
            return;
          }
    
          port.write(dataToWrite, (writeError) => {
            if (writeError) {
              reject(writeError);
            } else {
              resolve();
            }
          });
        });
      },

      listenForAngle: (path: string, callback: (angle: number) => void) => {
        angleListeners[path] = callback;
      },

      stopListeningForAngle: (path: string) => {
        delete angleListeners[path];
      }
    });
    
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}