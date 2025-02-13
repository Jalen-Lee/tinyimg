import {memo} from 'react';
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
import { type } from '@tauri-apps/plugin-os';

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
  compressedPath: string,
}

enum Action {
  OpenFile = 'open_file',
  Reveal = 'reveal',
  CopyPath = 'copy_path',
  DeleteInList = 'delete_in_list',
}

function FileCard(props: FileCardProps) {
  const { id,name,ext,size,compressedSize,formatSize,formatCompressedSize,compressStatus,assetPath,compressRate,compressedPath } = props;
  const t = useI18n();
  const { removeFile } = useCompressionStore(useSelector(['removeFile']))

  const items: MenuProps['items'] = [
    {
      key: Action.OpenFile,
      label: t('compression.file_action.open_file'),
      icon: <SquareArrowOutUpRight className="h-4 w-4" />,
    },
    {
      key: Action.Reveal,
      label: type() === 'macos' ? t('compression.file_action.reveal_in_finder') : t('compression.file_action.reveal_in_exploer'),
      icon: <FolderOpenIcon className="h-4 w-4" />,
    },
    {
      key: Action.CopyPath,
      label: t('compression.file_action.copy_path'),
      icon: <ClipboardCopy className="h-4 w-4" />,
    },
    {
      key: Action.DeleteInList,
      label: t('compression.file_action.delete_in_list'),
      icon: <Trash2Icon className="h-4 w-4" />,
      danger: true,
    },
  ];

  const handleFileCardMenuClick:MenuProps['onClick'] = async ({ key }) => {
    switch(key){
      case Action.OpenFile:
        if(compressStatus === IScheduler.TaskStatus.Done){
          openPath(compressedPath)
        }else{
          openPath(id)
        }
        break;
      case Action.Reveal:
        if(compressStatus === IScheduler.TaskStatus.Done){
          revealItemInDir(compressedPath)
        }else{
          revealItemInDir(id)
        }
        break;
      case Action.DeleteInList:
        removeFile(id)
        break;
      case Action.CopyPath:
        if(compressStatus === IScheduler.TaskStatus.Done){
          await writeText(compressedPath)
        }else{
          await writeText(id)
        }
        toast.success(t('tips.file_path_copied'))
        break;
    }
  }

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
            className="aspect-[4/3] object-contain"
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