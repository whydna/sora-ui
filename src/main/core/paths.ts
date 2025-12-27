import { app } from 'electron';
import path from 'path';

const getResourcesPath = () => {
  if (app.isPackaged) {
    return process.resourcesPath;
  } else {
    return path.resolve(__dirname, '../../resources/');
  }
} 

const getProjectsPath = () => {
  return path.join(app.getPath('userData'), 'projects');
}

export { getResourcesPath, getProjectsPath };
