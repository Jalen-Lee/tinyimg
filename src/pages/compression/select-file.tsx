import {memo,useCallback,useEffect,useRef,useContext} from 'react';
import { useAsyncEffect } from 'ahooks';
import { UnlistenFn } from '@tauri-apps/api/event';
import {isFunction} from 'radash';
import { open } from '@tauri-apps/plugin-dialog';
import { parseFiles } from '../../utils/fs';
import useSelector from '@/hooks/useSelector';
import useAppStore from '../../store/app.store';
import { getCurrentWebview } from '@tauri-apps/api/webview';
import {ImagePlus} from 'lucide-react'
import useCompressionStore from '../../store/compression';
import { CompressionContext } from '.';
import {isValidArray} from '@/utils';

const validExts = ['png', 'jpg', 'jpeg', 'webp']

function SelectFile(){
  const {
    progressRef
  } = useContext(CompressionContext)

  const dragDropController = useRef<UnlistenFn | null>(null);
  const {
    setHasSelected,
    setFiles,
    setSelectedFiles
  } = useCompressionStore(useSelector(['setHasSelected','setFiles','setSelectedFiles']))

	const handleFiles = async (files: string[] | null) => {
		if(!isValidArray(files)) return;
		progressRef.current?.show(true)
		// setTimeout(()=>{
		// 	progressRef.current?.done()
		// },5000)
		const {
			files: fileInfos,
		} = await parseFiles(files!,validExts);
		setHasSelected(true);
		setFiles(fileInfos);
		setSelectedFiles(fileInfos.map(file=>file.id))
		setTimeout(()=>{
			progressRef.current?.done()
		},100)
	}

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

			} else if (event.payload.type === 'drop') {
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
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">图片压缩</h1>
      <p className="mb-8">通过我们的工具，您可以轻松地压缩图片，减少文件大小，提高加载速度。</p>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center cursor-pointer
          ${true ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        onClick={handleSelectFile}
      >
        <div className="mb-4">
          <ImagePlus size={64} className="mx-auto mb-4" />
          <p className="text-lg font-semibold">✨ 鼠标拖入图片文件或文件夹 ✨</p>
        </div>
        
        <div className="text-sm text-gray-600">
          <p className="mb-2">支持的图像格式</p>
          <p className="mb-1">PNG · JPEG · WebP · AVIF</p>
        </div>
      </div>
    </div>
  )
}

export default memo(SelectFile)