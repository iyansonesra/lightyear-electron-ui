interface SerialPortApi {
    list: () => Promise<string[]>;
    reset: (path: string) => Promise<void>;
  }
  
  declare global {
    interface Window {
      serialport: SerialPortApi;
    }
  }
  
  export {};