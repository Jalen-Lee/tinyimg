import { useState, useCallback, useRef,createContext } from 'react';
import SelectFile from './select-file';
import useCompressionStore from '@/store/compression';
import useSelector from '@/hooks/useSelector';
import FileExplorer from './file-explorer';
import { ScrollArea } from '@radix-ui/themes';
import { FullscreenProgress, FullscreenProgressRef } from '@/components/fullscreen-progress';

export const CompressionContext = createContext<{
  progressRef: React.RefObject<FullscreenProgressRef>
}>({
  progressRef: null,
})

export default function Compression() {
  const {
    hasSelected,
  } = useCompressionStore(useSelector(['hasSelected']))

  const progressRef = useRef<FullscreenProgressRef>(null)

  return (
    <CompressionContext.Provider value={{ progressRef }}>
      <div className="h-full bg-white overflow-auto">
        <FullscreenProgress ref={progressRef} />
        {hasSelected ? <FileExplorer /> : <SelectFile />}
      </div>
    </CompressionContext.Provider>
  );
}
