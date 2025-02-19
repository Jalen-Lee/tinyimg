import { create } from 'zustand';
import EventEmitter from 'eventemitter3';

interface CompressionState {
  eventEmitter: EventEmitter;
  files: FileInfo[];
  fileMap: Map<string, FileInfo>;
  selectedFiles: string[];
  inCompressing: boolean;
  inSaving: boolean;
}

interface CompressionAction{
  setInCompressing: (inCompressing: boolean)=>void;
  setInSaving: (inSaving: boolean)=>void;
  getFileById: (id: string)=>FileInfo | undefined;
  setFiles: (files: FileInfo[])=>void;
  removeFile: (id: string)=>void;
  clearFiles: ()=>void;
  setSelectedFiles: (selectedFiles: string[])=>void;
  clearSelectedFiles: ()=>void;
  reset: ()=>void;
}

const useCompressionStore = create<CompressionState & CompressionAction>(
  (set, get) => ({
    eventEmitter: new EventEmitter(),
    files: [],
    fileMap: new Map(),
    selectedFiles: [],
    inCompressing: false,
    inSaving: false,
    setInCompressing: (inCompressing: boolean)=>{
      set({ inCompressing });
    },

    setInSaving: (inSaving: boolean)=>{
      set({ inSaving });
    },

    getFileById: (id: string)=>{
      return get().fileMap.get(id)
    },
    setFiles: (files: FileInfo[])=>{
      set({ 
        files,
        fileMap: new Map(files.map(file=>[file.id,file])),
        selectedFiles: get().selectedFiles.filter(id=>files.some(f=>f.id === id))
      });
    },
    clearFiles: ()=>{
      set({ 
        files: [],
        fileMap: new Map(),
        selectedFiles: []
      });
    },
    removeFile: (id: string)=>{
      const targetIndex = get().files.findIndex(file=>file.id === id)
      if(targetIndex !== -1){
        get().files.splice(targetIndex,1)
        get().fileMap.delete(id)
        const selectedFiles = get().selectedFiles.filter(file=>file !== id)
        set({ 
          files: [...get().files],
          fileMap: new Map(get().fileMap),
          selectedFiles
        })
      }
    },
    
    setSelectedFiles: (selectedFiles: string[])=>{
      set({ selectedFiles });
    },
    clearSelectedFiles: ()=>{
      set({ selectedFiles: [] });
    },
    reset: ()=>{
      set({
        inCompressing: false,
        inSaving: false,
        files: [],
        fileMap: new Map(),
        selectedFiles: []
      });
    }
  })
);

export default useCompressionStore;