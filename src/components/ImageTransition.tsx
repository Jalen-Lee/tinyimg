'use client'

import { useState, useEffect, useRef } from 'react'

interface ImageTransitionProps {
  lightImage: string
  darkImage: string
}

export function ImageTransition({ lightImage, darkImage }: ImageTransitionProps) {
  const [position, setPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const handle = handleRef.current

    if (!container || !handle) return

    const onMouseDown = () => {
      setIsDragging(true)
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const containerRect = container.getBoundingClientRect()
      const newPosition = ((e.clientX - containerRect.left) / containerRect.width) * 100
      setPosition(Math.max(0, Math.min(100, newPosition)))
    }

    const onMouseUp = () => {
      setIsDragging(false)
    }

    handle.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      handle.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging])


  return (
    <div className="relative w-full h-[80vh] overflow-hidden select-none" ref={containerRef}>
      <img src={lightImage} alt="Light mode" className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img src={darkImage} alt="Dark mode" className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none" />
      </div>
      <div
        ref={handleRef}
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize touch-action-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12H3M21 6H3M21 18H3" />
          </svg>
        </div>
      </div>
    </div>
  )
}

