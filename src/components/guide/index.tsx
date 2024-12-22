import {memo, useCallback,useEffect,useRef} from 'react'
import {PictureFilled} from '@ant-design/icons'
import { useAsyncEffect } from 'ahooks';
import { UnlistenFn } from '@tauri-apps/api/event';
import {isFunction,isEmpty} from 'radash'
import { open } from '@tauri-apps/plugin-dialog';
import { getCurrentWebview } from '@tauri-apps/api/webview';

import { parseFiles } from '../../utils/fs';
import useSelector from '@/hooks/useSelector';
import useAppStore from '../../store/app.store';
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';

const validExts = ['png', 'jpg', 'jpeg', 'webp']

function Guide(){
	const dragDropController = useRef<UnlistenFn | null>(null);
	const {
		setWorkspace
	} = useAppStore(useSelector(['setWorkspace']))

	const handleFiles = useCallback(async (files: string[] | null) => {
		if(!isEmpty(files)){
			const {
				files: fileInfos,
				fileMap
			} = await parseFiles(files!,validExts)
			setWorkspace({
				hasFile: true,
				fileList: fileInfos,
				fileMap,
				fileTree: []
			})
			await getCurrentWindow().setSize(new LogicalSize(1002, 670));
		}
	},[])

	const handleSelectFile = useCallback(async() => {
		const files = await open({
			multiple: true,
			directory: false,
			recursive: true,
			filters: [
				{
					name: 'Images',
					extensions: validExts,
				},
			],
		});
		handleFiles(files);
	}, [])

	useAsyncEffect(async()=>{
		dragDropController.current = await getCurrentWebview().onDragDropEvent(async (event) => {
			if (event.payload.type === 'over') {
				// console.log('User hovering', event.payload.position);
			} else if (event.payload.type === 'drop') {
				console.log("event",event)
				console.log('User dropped', event.payload.paths);
				handleFiles(event.payload.paths);
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
				onClick={handleSelectFile}
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