import { memo } from 'react';
import { Image, Tooltip } from 'antd';
import ImgTag from '@/components/img-tag';


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
            <div className='text-[14px] font-bold max-w-[200px] text-nowrap overflow-hidden truncate'>{data.name}</div>
            <div className='flex gap-[5px] items-center'>
              <ImgTag type={data.ext} />
              <div className='text-[12px] text-gray-500'>{data.formatSize}</div>
            </div>
          </div>
        </div>
        {
          data.hasProcess && (
            <div className='flex gap-[10px] items-center'>
              <div className='flex flex-col'>
                <div className='text-[14px] text-black font-bold'>-77%</div>
                <div className='text-[12px] text-gray-500'>{data.formatCompressedSize}</div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}

export default memo(TaskItem);
