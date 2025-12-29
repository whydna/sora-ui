import { contextBridge, ipcRenderer } from 'electron';
import { Project, Scene } from 'src/shared/types';

const ipc = {
  generateVideo: (scene: Scene) =>
    ipcRenderer.invoke('video:create', scene.referenceImage, scene.prompt),
  getProjects: (): Promise<Project[]> =>
    ipcRenderer.invoke('getProjects'),
  createProject: (name: string): Promise<Project> =>
    ipcRenderer.invoke('createProject', name),
  addScene: (projectId: string): Promise<Project | null> =>
    ipcRenderer.invoke('addScene', projectId),
  updateScene: (projectId: string, sceneId: string, updates: Partial<Scene>): Promise<Project | null> =>
    ipcRenderer.invoke('updateScene', projectId, sceneId, updates),
}

declare global {
  interface Window {
    ipc: typeof ipc;
  }
}


contextBridge.exposeInMainWorld('ipc', ipc);
