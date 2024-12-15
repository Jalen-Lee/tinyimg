import {memo, useCallback,useEffect,useRef} from 'react'
import {PictureFilled} from '@ant-design/icons'
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { useAsyncEffect } from 'ahooks';
import { UnlistenFn } from '@tauri-apps/api/event';
import {isFunction} from 'radash'
import { open } from '@tauri-apps/plugin-dialog';
import { readDir, BaseDirectory } from '@tauri-apps/plugin-fs';
import { tinypng } from '../../utils';

function Guide(){
	const dragDropController = useRef<UnlistenFn | null>(null);

	const handleClick = useCallback(async() => {
		// tinypng();
		// const files = await open({
		// 	multiple: true,
		// 	directory: false,
		// 	recursive: true,
		// });
		// console.log(files);
	}, [])

	const handleFiles = (files: File[]) => {
		const validTypes = ['image/png', 'image/jpeg', 'image/webp']
		const imageFiles = files.filter(file => validTypes.includes(file.type))
		if(imageFiles.length > 0) {
			// TODO: 处理图片文件
			console.log('上传的图片文件:', imageFiles)
		}
	}

	useAsyncEffect(async()=>{
		dragDropController.current = await getCurrentWebview().onDragDropEvent(async (event) => {
			if (event.payload.type === 'over') {
				// console.log('User hovering', event.payload.position);
			} else if (event.payload.type === 'drop') {
				console.log("event",event)

				console.log('User dropped', event.payload.paths);
				const entries = await readDir(event.payload.paths[0])
				console.log("entries",entries)
			} else {
				console.log('File drop cancelled');
			}
		 });
	},[])

	useEffect(()=>{
		return ()=>{
			if(isFunction(dragDropController.current)) dragDropController.current(); 
		}
	},[])

	return (
		<section className="h-full p-[10px]">
			<div 
				className='cursor-pointer flex items-center justify-center h-full border-dashed rounded-[20px] border-4 border-sky-500'
				onClick={handleClick}
			>
				<div className='flex flex-col items-center justify-center'>
					<PictureFilled className='text-[124px] text-slate-500'/>
					<div className='text-slate-500'>点击或拖拽图片、目录开始</div>
					<div className='text-[14px] text-slate-500'>1. 支持PNG、JPG/JPEG、WEBP</div>
				</div>
			</div>
		</section>
	)
}

export default memo(Guide)