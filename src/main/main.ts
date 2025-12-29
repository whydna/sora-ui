import { app, BrowserWindow, ipcMain, net, protocol } from 'electron';
import started from 'electron-squirrel-startup';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../shared/app-config';
import { Project, Scene } from '../shared/types';
import { Store } from './core/store';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Register custom protocol for serving local files
protocol.registerSchemesAsPrivileged([
  { scheme: 'local-file', privileges: { secure: true, supportFetchAPI: true, stream: true } }
]);

// IPC Handlers for video generation
ipcMain.handle('generateVideo', async (_event, imageBase64: string, fileName: string, prompt: string) => {
  const buffer = Buffer.from(imageBase64, 'base64');
  const imageFile = new File([buffer], fileName, { type: 'image/png' });

  const video = await openai.videos.create({
    model: 'sora-2',
    input_reference: imageFile,
    size: '1280x720',
    prompt,
  });
  return video.id;
});

// ipcMain.handle('video:poll', async (_event, videoId: string) => {
//   const video = await openai.videos.retrieve(videoId);

//   if (video.status === 'completed') {
//     const response = await openai.videos.downloadContent(videoId);
//     return { status: 'completed', url: response.url };
//   } else if (video.status === 'failed') {
//     return { status: 'failed', error: video.error?.message };
//   }

//   return { status: video.status };
// });

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
    renders: [{ id: crypto.randomUUID(), soraVideoId: '', status: 'pending' }],
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

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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
  // Handle local-file:// protocol requests
  protocol.handle('local-file', (request) => {
    const filePath = decodeURIComponent(request.url.slice('local-file://'.length));
    return net.fetch(pathToFileURL(filePath).href);
  });

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
