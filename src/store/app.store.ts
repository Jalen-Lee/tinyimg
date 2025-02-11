import { create } from 'zustand';
import EventEmitter from 'eventemitter3';
import { load,Store } from '@tauri-apps/plugin-store';
import { SETTINGS_FILE_NAME,SettingsKey, SettingsCompressionTaskConfigOutputMode } from '@/constants';
import { downloadDir } from '@tauri-apps/api/path';

interface AppState {
  eventEmitter: EventEmitter;

}

interface AppAction{

}

const useAppStore = create<AppState & AppAction>(
  (set, get) => ({
    eventEmitter:new EventEmitter(),
  })
);

export default useAppStore;