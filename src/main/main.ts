import { app, BrowserWindow, ipcMain } from 'electron';
import started from 'electron-squirrel-startup';
import fs from 'node:fs/promises';
import path from 'node:path';
import OpenAI, { toFile } from 'openai';
import { Project, Render, Scene, UserSettings } from '../shared/types';
import { resizeImage } from './core/images';
import { getProjectPath } from './core/paths';
import { Store } from './core/store';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// IPC Handlers for video generation
ipcMain.handle('renderScene', async (_event, projectId: string, sceneId: string) => {
  const project = Store.projects.find((p) => p.id === projectId);
  if (!project) return null;

  const scene = project.scenes.find((s) => s.id === sceneId);
  if (!scene) return null;

  // Resize reference image
  const imageBuffer = await resizeImage(scene.referenceImagePath);
  const imageFile = await toFile(imageBuffer, 'reference.png', { type: 'image/png' });

  const openai = new OpenAI({
    apiKey: Store.settings.openaiApiKey,
  });

  // Create video job
  const videoJob = await openai.videos.create({
    model: 'sora-2',
    input_reference: imageFile,
    size: '1280x720',
    prompt: scene.prompt,
  });

  // Create render entry
  const render: Render = {
    id: crypto.randomUUID(),
    soraVideoId: videoJob.id,
    status: 'pending',
  };
  scene.renders.push(render);
  Store.save();

  // Poll for completion
  let video = await openai.videos.retrieve(videoJob.id);
  while (video.status === 'queued' || video.status === 'in_progress') {
    await new Promise((r) => setTimeout(r, 5000));
    video = await openai.videos.retrieve(videoJob.id);

    // Update status to processing
    if (video.status === 'in_progress' && render.status === 'pending') {
      render.status = 'processing';
      Store.save();
    }
  }

  if (video.status === 'completed') {
    // Download and save video
    const response = await openai.videos.downloadContent(videoJob.id);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const projectDir = getProjectPath(projectId);
    const videoPath = path.join(projectDir, `${render.id}.mp4`);
    await fs.writeFile(videoPath, buffer);

    render.status = 'completed';
    render.videoPath = videoPath;
  } else {
    render.status = 'failed';
  }

  Store.save();
  return project;
});

ipcMain.handle('getProjects', () => Store.projects);

ipcMain.handle('createProject', async (_event, name: string) => {
  const project: Project = {
    id: crypto.randomUUID(),
    name,
    scenes: [],
  };
  Store.projects.push(project);
  Store.save();

  // Create project directory
  const projectDir = getProjectPath(project.id);
  await fs.mkdir(projectDir, { recursive: true });

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
