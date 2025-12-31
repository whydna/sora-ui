import ElectronStore from 'electron-store';
import { Project, UserSettings } from 'src/shared/types';

const electronStore = new ElectronStore();

const Store = {
  projects: [] as Project[],
  settings: { openaiApiKey: '', veoApiKey: '' } as UserSettings,

  load() {
    if (electronStore.get('projects')) {
      this.projects = electronStore.get('projects', [])
        .map((data: unknown) => data as Project);
    }
    if (electronStore.get('settings')) {
      this.settings = electronStore.get('settings', { openaiApiKey: '', veoApiKey: '' }) as UserSettings;
    }
  },

  save() {
    electronStore.set('projects', this.projects);
    electronStore.set('settings', this.settings);
  }
}

Store.load()

export { Store };
