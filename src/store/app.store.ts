import { create } from 'zustand';
import EventEmitter from 'eventemitter3';
import { load,Store } from '@tauri-apps/plugin-store';

interface AppState {
  eventEmitter: EventEmitter;
  settingStore: Store | null;
  settings: Map<string, any>;
}

interface AppAction{
  loadSettings: ()=>Promise<void>;
  getSettings: <T>(key: string)=>T;
  setSettings: (key: string, value: any)=>Promise<void>;
  refreshSettings: ()=>Promise<void>;
}

const useAppStore = create<AppState & AppAction>(
  (set, get) => ({
    eventEmitter:new EventEmitter(),
    settingStore: null,
    settings: new Map(),
    loadSettings: async ()=>{
      const store = await load('settings.json', { autoSave: false });
      const entries = await store.entries();
      set({ 
        settingStore: store,
        settings: new Map(entries)
      });
    },
    getSettings: (key: string)=>{
      return get().settings.get(key);
    },
    setSettings: async (key: string, value: any)=>{
      const {settingStore, settings} = get();
      if(!settingStore) return;
      await settingStore.set(key, value);
      await settingStore.save();
      settings.set(key, value);
      set({ settings: new Map(settings) });
    },
    refreshSettings: async ()=>{
      const {settingStore} = get();
      if(!settingStore) return;
      await settingStore.reload();
      const entries = await settingStore.entries();
      set({ settings: new Map(entries) });
    }
  })
);

export default useAppStore;

(async function(){
  await useAppStore.getState().loadSettings();
})();