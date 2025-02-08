import {memo,useCallback} from 'react';
import ImgTag from '@/components/img-tag';
import { CheckboxGroup } from '@radix-ui/themes';
import { Button } from '@/components/ui/button';
import {SquareArrowOutUpRight,Trash2Icon,FolderOpenIcon,ClipboardCopy} from 'lucide-react'
import { Dropdown, MenuProps } from 'antd';
import { openPath,revealItemInDir } from '@tauri-apps/plugin-opener';
import useCompressionStore from '@/store/compression';
import useSelector from '@/hooks/useSelector';
import { writeText} from '@tauri-apps/plugin-clipboard-manager';
import { toast } from 'sonner';


export interface FileCardProps {
  data: FileInfo
}

const items: MenuProps['items'] = [
  {
    key: 'open_file',
    label: 'Open File',
    icon: <SquareArrowOutUpRight className="h-4 w-4" />,
  },
  {
    key: 'reveal_in_finder',
    label: 'Reveal in Finder',
    icon: <FolderOpenIcon className="h-4 w-4" />,
  },
  {
    key: 'copy_path',
    label: 'Copy File Path',
    icon: <ClipboardCopy className="h-4 w-4" />,
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: <Trash2Icon className="h-4 w-4" />,
    danger: true,
  },
];

function FileCard(props: FileCardProps) {
  const { data } = props;
  const { removeFile } = useCompressionStore(useSelector(['removeFile']))

  const handleFileCardMenuClick:MenuProps['onClick'] = useCallback(async ({ key }) => {
    switch(key){
      case 'open_file':
        openPath(data.id)
        break;
      case 'reveal_in_finder':
        revealItemInDir(data.id)
        break;
      case 'delete':
        removeFile(data.id)
        break;
      case 'copy_path':
        await writeText(data.id)
        toast.success('File path copied to clipboard!')
        break;
    }
  }, [data.id, removeFile])

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleFileCardMenuClick
      }}
      trigger={['contextMenu']}
      placement="bottomLeft"
      destroyPopupOnHide
      arrow
    >
      <div className="group relative overflow-hidden rounded-lg border bg-white hover:shadow-lg transition-all duration-300">
        <div className="aspect-[4/3] overflow-hidden relative bg-gray-100 flex items-center justify-center">
          <div className="absolute top-2 left-2">
            <CheckboxGroup.Item value={data.id}/>
          </div>
          <div className="absolute bottom-2 left-2">
            <ImgTag type={data.ext} />
          </div>
          <img
            src={data.assetPath}
            alt={data.name}
            className="aspect-auto object-contain"
            loading="lazy"
          />
        </div>
        <div className="p-2">
          <h3 className="font-medium text-gray-900 text-ellipsis overflow-hidden whitespace-nowrap max-w-[100%]">{data.name}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{data.formatSize}</span>
          </div>
        </div>
      </div>
    </Dropdown>
  )
}

export default memo(FileCard)