import { create } from 'zustand';

interface CompressionState {
  hasSelected: boolean;
  files: FileInfo[];
  fileMap: Map<string, FileInfo>;
  selectedFiles: string[];
}

interface CompressionAction{
  getFile: (key: string)=>FileInfo | undefined;
  setHasSelected: (hasSelected: boolean)=>void;
  setFiles: (files: FileInfo[])=>void;
  clearFiles: ()=>void;
  setFileMap: (fileMap: Map<string, FileInfo>)=>void;
  clearFileMap: ()=>void;
  setSelectedFiles: (selectedFiles: string[])=>void;
  clearSelectedFiles: ()=>void;
}

const useCompressionStore = create<CompressionState & CompressionAction>(
  (set, get) => ({
    hasSelected: false,
    files: [],
    fileMap: new Map(),
    selectedFiles: [],
    getFile: (key: string)=>{
      return get().fileMap.get(key)
    },
    setHasSelected: (hasSelected: boolean)=>{
      set({ hasSelected });
    },
    setFiles: (files: FileInfo[])=>{
      set({ files });
    },
    clearFiles: ()=>{
      set({ files: [] });
    },
    setFileMap: (fileMap: Map<string, FileInfo>)=>{
      set({ fileMap });
    },
    clearFileMap: ()=>{
      set({ fileMap: new Map() });
    },
    setSelectedFiles: (selectedFiles: string[])=>{
      set({ selectedFiles });
    },
    clearSelectedFiles: ()=>{
      set({ selectedFiles: [] });
    }
  })
);

export default useCompressionStore;