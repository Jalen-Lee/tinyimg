import { lstat } from '@tauri-apps/plugin-fs';
import { basename,extname } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/core';
import mime from 'mime';
import { IScheduler } from '@/utils/scheduler';
import { invoke } from '@tauri-apps/api/core';



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
		if(info.isDirectory){
			const candidates = await invoke<string[]>('parse_dir',{
				path: filePath,
				valid_exts: validExts
			})
			console.log('candidates',candidates)
			if(candidates.length > 0){
				for(const candidate of candidates){
					const info = await lstat(candidate)
					const ext = await extname(candidate)
					const fileInfo: FileInfo = {
						id: candidate,
						path: candidate,
						assetPath: convertFileSrc(candidate),
						name: await basename(candidate),
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
						compressStatus: IScheduler.TaskStatus.Pending
					}
					fileMap.set(candidate, fileInfo)
					files.push(fileInfo)
				}
			}
		}else{
			const ext = await extname(filePath)
			if(!validExts.includes(ext)) continue;
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
				compressStatus: IScheduler.TaskStatus.Pending
			}
			fileMap.set(filePath, fileInfo)
			files.push(fileInfo)
		}
	}
	return { files, fileMap }
}

