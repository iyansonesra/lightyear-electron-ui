import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { SerialPort, ReadlineParser  } from 'serialport';



// Custom APIs for renderer
const api = {}


console.log('resetting port');

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    
    const openPorts = {};

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
