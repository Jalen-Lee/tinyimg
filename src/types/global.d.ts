import { ProcessorType } from '@/utils/processor';
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
    compressedSize: number;
    formatCompressedSize: string;
    compressRate: string;
    compressStatus: ProcessorType.TaskStatus;
    errorMessage?: string;
  }
}

export {};