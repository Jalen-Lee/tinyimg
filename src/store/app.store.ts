import { create } from 'zustand';
import EventEmitter from 'eventemitter3';

interface AppState {
  eventEmitter: EventEmitter;
  workspace: {
    hasFile: boolean;
    fileList: FileInfo[];
    fileMap: Map<FileInfo['id'], FileInfo>;
    fileTree: any[]
  }
}

interface AppAction{
  setWorkspace: (payload: AppState['workspace'])=>void;
  resetWorkspace: ()=>void;
  getFileById: (id: FileInfo['id']) => FileInfo | undefined;
}

const useAppStore = create<AppState & AppAction>(
  (set, get) => ({
    eventEmitter:new EventEmitter(),
    workspace:{
      hasFile: false,
      fileList: [],
      fileMap: new Map(),
      fileTree: []
    },

    setWorkspace(payload,){
      set({
        workspace: payload
      })
    },
    resetWorkspace(){
      set({
        workspace: {
          hasFile: false,
          fileList: [],
          fileMap: new Map(),
          fileTree: []
        }
      })
    },
    getFileById(id){
      return get().workspace.fileMap.get(id)
    }
  })
);

export default useAppStore;