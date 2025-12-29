import ElectronStore from 'electron-store';
import { Project } from 'src/shared/types';

const electronStore = new ElectronStore();

const Store = {
  projects: [] as Project[],

  load() {
    if (electronStore.get('projects')) {
      this.projects = electronStore.get('projects', [])
        .map((data: unknown) => data as Project);
    }
  },

  save() {
    electronStore.set('projects', this.projects);
  }
}

Store.load()

export { Store };
