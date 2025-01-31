import { memo } from 'react';
import { Image } from 'antd';
import ImgTag from '@/components/img-tag';
import { ProcessorType } from '@/utils/processor';
import {SyncOutlined} from '@ant-design/icons'
import { Badge,Tooltip } from '@radix-ui/themes'

export interface TaskItemProps{
  data:FileInfo
}


function TaskItem(props:TaskItemProps) {
  const {data} = props
  return (
    <div className='w-full cursor-pointer'>
      <div className='flex justify-between items-center gap-[20px]'>
        <div className='flex gap-[10px]'>
          <Image 
            width={48} 
            height={48} 
            src={data.assetPath} 
            preview={false}
            className='rounded-md w-[48px] h-[48px] object-cover aspect-square'
          />
          <div className='flex flex-col'>
            <div className='text-[14px] font-bold max-w-[100px] text-nowrap overflow-hidden truncate'>{data.name}</div>
            <div className='flex gap-[5px] items-center'>
              <ImgTag type={data.ext} />
              <div className='text-[12px] text-gray-500'>{data.formatSize}</div>
            </div>
          </div>
        </div>
        {
          data.compressStatus === ProcessorType.TaskStatus.Completed && (
            <div className='flex gap-[10px] items-center'>
              <div className='flex flex-col items-end'>
                <div className='text-[14px] text-black font-bold'>{`-${data.compressRate}`}</div>
                <div className='text-[12px] text-gray-500'>{data.formatCompressedSize}</div>
              </div>
            </div>
          )
        }
        {
          data.compressStatus === ProcessorType.TaskStatus.Processing && (
            <SyncOutlined spin/>
          )
        }
        {
          data.compressStatus === ProcessorType.TaskStatus.Failed && (
            <Tooltip content={data.errorMessage || 'Unknown error'}>
              <Badge color="red">Error</Badge>
            </Tooltip>
          )
        }
      </div>
    </div>
  );
}

export default memo(TaskItem,(prev,next)=>{
  return prev.data.compressStatus !== next.data.compressStatus
});