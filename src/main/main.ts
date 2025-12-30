import { app, BrowserWindow, ipcMain } from 'electron';
import started from 'electron-squirrel-startup';
import path from 'node:path';
import OpenAI from 'openai';
import { Project, Scene, UserSettings } from '../shared/types';
import { Store } from './core/store';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// IPC Handlers for video generation
ipcMain.handle('generateVideo', async (_event, imageBase64: string, fileName: string, prompt: string) => {
  const buffer = Buffer.from(imageBase64, 'base64');
  const imageFile = new File([buffer], fileName, { type: 'image/png' });

  const openai = new OpenAI({
    apiKey: Store.settings.openaiApiKey,
  });

  const video = await openai.videos.create({
    model: 'sora-2',
    input_reference: imageFile,
    size: '1280x720',
    prompt,
  });
  return video.id;
});

ipcMain.handle('getProjects', () => Store.projects);

ipcMain.handle('createProject', (_event, name: string) => {
  const project: Project = {
    id: crypto.randomUUID(),
    name,
    scenes: [],
  };
  Store.projects.push(project);
  Store.save();
  return project;
});

ipcMain.handle('addScene', (_event, projectId: string) => {
  const project = Store.projects.find((p) => p.id === projectId);
  if (!project) return null;

  const scene: Scene = {
    id: crypto.randomUUID(),
    name: 'Untitled Scene',
    prompt: '',
    referenceImagePath: '',
    renders: [],
  };
  project.scenes.push(scene);
  Store.save();
  return project;
});

ipcMain.handle('updateScene', (_event, projectId: string, sceneId: string, updates: Partial<Scene>) => {
  const project = Store.projects.find((p) => p.id === projectId);
  if (!project) return null;

  const scene = project.scenes.find((s) => s.id === sceneId);
  if (!scene) return null;

  Object.assign(scene, updates);
  Store.save();
  return project;
});

ipcMain.handle('getSettings', () => Store.settings);

ipcMain.handle('updateSettings', (_event, settings: Partial<UserSettings>) => {
  Object.assign(Store.settings, settings);
  Store.save();
  return Store.settings;
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  mainWindow.webContents.openDevTools();
};

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  Store.save();
});  
