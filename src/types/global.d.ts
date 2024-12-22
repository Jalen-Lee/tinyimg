declare global {
  interface FileInfo {
    id: string;
    name: string;
    path: string;
    assetPath: string;
    size: number;
    formatSize: string;
    isDir: boolean;
    isFile: boolean;
    isSymlink: boolean;
    mimeType: string;
    ext: string;
    hasProcess: boolean;
    compressedSize: number;
    formatCompressedSize: string;
  }
}

export {};