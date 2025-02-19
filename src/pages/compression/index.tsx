import { useRef,createContext } from 'react';
import { Outlet } from 'react-router';
import { FullscreenProgress, FullscreenProgressRef } from '@/components/fullscreen-progress';

export const CompressionContext = createContext<{
  progressRef: React.RefObject<FullscreenProgressRef>
}>({
  progressRef: null,
})

export default function Compression() {
  const progressRef = useRef<FullscreenProgressRef>(null)
  return (
    <CompressionContext.Provider value={{ progressRef }}>
      <div className="h-full bg-white overflow-auto">
        <FullscreenProgress ref={progressRef} />
        <Outlet/>
      </div>
    </CompressionContext.Provider>
  );
}
