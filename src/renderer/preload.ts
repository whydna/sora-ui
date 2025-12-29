import { contextBridge, ipcRenderer } from 'electron';
import { Scene } from 'src/shared/types';
const ipc = {
  generateVideo: (scene: Scene) =>
    ipcRenderer.invoke('video:create', scene.referenceImage, scene.prompt),
}

declare global {
  interface Window {
    ipc: typeof ipc;
  }
}


contextBridge.exposeInMainWorld('ipc', ipc);
