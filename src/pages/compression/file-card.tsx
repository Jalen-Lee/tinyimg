import {memo,useCallback} from 'react';
import ImgTag from '@/components/img-tag';
import { CheckboxGroup } from '@radix-ui/themes';
import {SquareArrowOutUpRight,Trash2Icon,FolderOpenIcon,ClipboardCopy} from 'lucide-react'
import { Dropdown, MenuProps } from 'antd';
import { openPath,revealItemInDir } from '@tauri-apps/plugin-opener';
import useCompressionStore from '@/store/compression';
import useSelector from '@/hooks/useSelector';
import { writeText} from '@tauri-apps/plugin-clipboard-manager';
import { toast } from 'sonner';
import { IScheduler } from '@/utils/scheduler';
import { cn } from '@/lib/utils';
import { Badge } from '@radix-ui/themes';
import { useI18n } from '@/i18n';

export interface FileCardProps {
  id: string,
  name: string,
  ext: string,
  size: number,
  compressedSize: number,
  formatSize: string,
  formatCompressedSize: string,
  compressRate: string,
  compressStatus: IScheduler.TaskStatus,
  assetPath: string,
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
  const { id,name,ext,size,compressedSize,formatSize,formatCompressedSize,compressStatus,assetPath,compressRate } = props;
  const t = useI18n();
  const { removeFile } = useCompressionStore(useSelector(['removeFile']))

  const handleFileCardMenuClick:MenuProps['onClick'] = useCallback(async ({ key }) => {
    switch(key){
      case 'open_file':
        openPath(id)
        break;
      case 'reveal_in_finder':
        revealItemInDir(id)
        break;
      case 'delete':
        removeFile(id)
        break;
      case 'copy_path':
        await writeText(id)
        toast.success('File path copied to clipboard!')
        break;
    }
  }, [id, removeFile])

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
          <div className="absolute top-1 right-2">
            {
              compressStatus === IScheduler.TaskStatus.Processing &&
              <Badge color="orange" variant="solid">
                {t("processing")}
              </Badge>
            }
            {
              compressStatus === IScheduler.TaskStatus.Saving &&
              <Badge color="orange" variant="solid">
                {t("saving")}
              </Badge>
            }
            {
              compressStatus === IScheduler.TaskStatus.Completed &&
              <Badge color="green" variant="solid">
                {t("compressed")}
              </Badge>
            }
            {
              compressStatus === IScheduler.TaskStatus.Failed &&
              <Badge color="red" variant="solid">
                {t("failed")}
              </Badge>
            }
            {
              compressStatus === IScheduler.TaskStatus.Done &&
              <Badge color="blue" variant="solid">
                {t('saved')}
              </Badge>
            }
          </div>
          <div className="absolute top-2 left-2">
            <CheckboxGroup.Item value={id}/>
          </div>
          <div className="absolute bottom-2 left-2">
            <ImgTag type={ext} />
          </div>
          <img
            src={assetPath}
            alt={name}
            className="aspect-auto object-contain"
            loading="lazy"
          />
        </div>
        <div className="p-2">
          <h3 className="font-medium text-gray-900 text-ellipsis overflow-hidden whitespace-nowrap max-w-[100%]">{name}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className={cn(
                'text-[12px] text-gray-500',
                (compressStatus === IScheduler.TaskStatus.Completed || compressStatus === IScheduler.TaskStatus.Done) &&
                formatCompressedSize && "line-through"
              )}>{formatSize}</span>
              {
                (compressStatus === IScheduler.TaskStatus.Completed || compressStatus === IScheduler.TaskStatus.Done) &&
                formatCompressedSize && (
                  <span className="text-[12px] text-gray-500">{formatCompressedSize}</span>
                )
              }
            </div>
            {
              (compressStatus === IScheduler.TaskStatus.Completed || compressStatus === IScheduler.TaskStatus.Done) &&
              compressRate && (
                <div className="flex items-center gap-1">
                  <span className={
                    cn(
                      'text-[12px] text-gray-500',
                      compressedSize < size ? 'text-green-500' : 'text-red-500'
                    )
                  }>{
                    compressedSize <= size ?
                      `-${compressRate}` :
                      `+${compressRate}`
                  }</span>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </Dropdown>
  )
}

export default memo(FileCard)