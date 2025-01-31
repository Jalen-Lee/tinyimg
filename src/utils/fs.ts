import { lstat } from '@tauri-apps/plugin-fs';
import { basename,extname } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/core';
import mime from 'mime';
import { ProcessorType } from '@/utils/processor';


export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)}${units[i]}`;
}


export async function parseFiles(filePaths:string[],validExts:string[]){
	const files: FileInfo[] = []
	const fileMap = new Map<string, FileInfo>()
	for(const filePath of filePaths){
		const info = await lstat(filePath)
		const ext = await extname(filePath)
		if(validExts.includes(ext)){
			const fileInfo: FileInfo = {
				id: filePath,
				path: filePath,
				assetPath: convertFileSrc(filePath),
				name: await basename(filePath),
				size: info.size,
				formatSize: formatFileSize(info.size),
				isDir: info.isDirectory,
				isFile: info.isFile,
				isSymlink: info.isSymlink,
				mimeType: mime.getType(ext) ?? '',
				ext,
				compressedSize: 0,
				formatCompressedSize: formatFileSize(0),
				compressRate: '0%',
				compressStatus: ProcessorType.TaskStatus.Pending
			}
			fileMap.set(filePath, fileInfo)
			files.push(fileInfo)
		}
	}
	return { files, fileMap }
}

