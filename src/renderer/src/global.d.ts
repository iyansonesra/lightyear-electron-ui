interface SerialPortApi {
  list: () => Promise<string[]>;
  reset: (path: string) => Promise<void>;
  openPort: (path: string, baudRate: number) => Promise<void>;
  writeToPort: (path: string, dataToWrite: string) => Promise<void>;
  listenForAngle: (path: string, callback: (angle: number) => void) => void;
}


  declare global {
    interface Window {
      serialport: SerialPortApi;
      // api: ElectronAPI;
    }
  }
  
  export {};