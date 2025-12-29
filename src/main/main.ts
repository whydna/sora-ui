import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../shared/app-config';
import { Store } from './core/store';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// IPC Handlers for video generation
ipcMain.handle('video:create', async (_event, imageBase64: string, fileName: string, prompt: string) => {
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

ipcMain.handle('video:poll', async (_event, videoId: string) => {
  const video = await openai.videos.retrieve(videoId);
  
  if (video.status === 'completed') {
    const response = await openai.videos.downloadContent(videoId);
    return { status: 'completed', url: response.url };
  } else if (video.status === 'failed') {
    return { status: 'failed', error: video.error?.message };
  }
  
  return { status: video.status };
});

ipcMain.handle('getProjects', () => Store.projects);

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

app.on('ready', createWindow);

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
