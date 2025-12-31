import { contextBridge, ipcRenderer, webUtils } from 'electron';
import { Project, Scene, UserSettings } from '../shared/types';

const ipc = {
  renderScene: (projectId: string, sceneId: string): Promise<Project | null> =>
    ipcRenderer.invoke('renderScene', projectId, sceneId),
  getProjects: (): Promise<Project[]> =>
    ipcRenderer.invoke('getProjects'),
  createProject: (name: string): Promise<Project> =>
    ipcRenderer.invoke('createProject', name),
  addScene: (projectId: string): Promise<Project | null> =>
    ipcRenderer.invoke('addScene', projectId),
  updateScene: (projectId: string, sceneId: string, updates: Partial<Scene>): Promise<Project | null> =>
    ipcRenderer.invoke('updateScene', projectId, sceneId, updates),
  getPathForFile: (file: File): string =>
    webUtils.getPathForFile(file),
  getSettings: (): Promise<UserSettings> =>
    ipcRenderer.invoke('getSettings'),
  updateSettings: (settings: Partial<UserSettings>): Promise<UserSettings> =>
    ipcRenderer.invoke('updateSettings', settings),
  openPath: (path: string): Promise<void> =>
    ipcRenderer.invoke('openPath', path),
}

declare global {
  interface Window {
    ipc: typeof ipc;
  }
}


contextBridge.exposeInMainWorld('ipc', ipc);
