import {forwardRef,useImperativeHandle,useRef} from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

export interface FullscreenProgressRef {
  show: (ease?: boolean) => void;
  done: () => void;
  reset: () => void;
  setValue: (value: number) => void;
}

function easeOutCirc(x: number): number {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
}

const FullscreenProgress = forwardRef<
  FullscreenProgressRef,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  
  const rootRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number>(null)
  const isDoneRef = useRef<boolean>(false)

  const reset = ()=>{
    cancelAnimationFrame(timerRef.current)
    isDoneRef.current = false;
    if (indicatorRef.current) {
      indicatorRef.current.style.transform = `translateX(-100%)`
    }
    rootRef.current?.classList.add('hidden')
    rootRef.current?.parentElement?.style.removeProperty('position')
    rootRef.current?.parentElement?.style.removeProperty('overflow')
  }

  useImperativeHandle(ref, () => {
    return {
      show: (ease: boolean = false) => {
        if(!rootRef.current) return;
        rootRef.current?.classList.remove('hidden')
        rootRef.current.parentElement?.style.setProperty('position','relative')
        rootRef.current.parentElement?.style.setProperty('overflow','hidden')
        if (ease) {
          let progress = 0;
          const startTime = performance.now();
          const increment = (currentTime: number) => {
            if (indicatorRef.current) {
              const elapsedTime = (currentTime - startTime) / 1000; // 转换为秒
              const maxTime = 10; // 最大时间100秒
              const t = Math.min(elapsedTime / maxTime, 1); // 计算进度时间比例
              progress = easeOutCirc(t) * 100; // 使用easeOutCirc函数计算进度
              if (progress < 100 && !isDoneRef.current) {
                indicatorRef.current.style.transform = `translateX(-${100 - progress}%)`;
                timerRef.current = requestAnimationFrame(increment);
              }
            }
          };
          timerRef.current = requestAnimationFrame(increment);
        }
      },
      done:()=>{
        isDoneRef.current = true;
        if (indicatorRef.current) {
          indicatorRef.current.style.transform = `translateX(0%)`
        }
        setTimeout(reset, 500)
      },
      reset,
      setValue: (value: number) => {
        if (indicatorRef.current) {
          indicatorRef.current.style.transform = `translateX(-${100 - value}%)`
        }
      }
    }
  })

  return (
    <div className="z-10 absolute top-0 left-0 bg-white h-full w-full flex items-center justify-center hidden" ref={rootRef}>
      <div
        className={cn(
          "relative h-2 w-[50%] overflow-hidden rounded-full bg-neutral-900/20 dark:bg-neutral-50/20",
          className
        )}
        {...props}
      >
        <div
          ref={indicatorRef}
          className="h-full w-full flex-1 bg-neutral-900 transition-all dark:bg-neutral-50"
          style={{ transform: `translateX(-100%)` }}
        />
      </div>
    </div>
  )
})

FullscreenProgress.displayName = 'FullscreenProgress'

export { FullscreenProgress }
