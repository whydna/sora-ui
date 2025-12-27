import ElectronStore from 'electron-store';
import { Scene } from 'src/shared/types';

const electronStore = new ElectronStore();

const Store = {
  scenes: [] as Scene[],
  
  load() {
    if (electronStore.get('scenes')) {
      this.scenes = electronStore.get('scenes', [])
        .map((data: unknown) => data as Scene);
    }
  },

  save() {
    electronStore.set('scenes', this.scenes);
  }
}

Store.load()

export { Store };
