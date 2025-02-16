import { memo } from 'react'
import { Modal } from 'antd'
import { Button } from '@/components/ui/button'
import { SquareSplitHorizontal, SeparatorVertical } from 'lucide-react'
import './index.css'

interface ImageTransitionProps {
  originalImage: string
  editedImage: string
}

export const ImageTransition = memo(({ originalImage, editedImage }: ImageTransitionProps) => {

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const parent = e.target.parentNode as HTMLElement
    if (parent) {
      parent.style.setProperty('--pos', String(Number(value) / 100))
    }
  }


  return (
    <div className="image-comparison">
      <div className="image-comparison-original">
        <img src={originalImage} alt="original" className="image-comparison-original-image" />
      </div>
      <div className="image-comparison-range-container">
        <input type="range" onInput={handleInput} className="image-comparison-range" />
        {/* <SeparatorVertical className="image-comparison-separator w-6 h-6" /> */}
      </div>
      <div className="image-comparison-edited">
        <img src={editedImage} alt="edited" className="image-comparison-edited-image" />
      </div>
    </div>
  )
})


export interface CompareBtnProps {
  originalImage: string;
  editedImage: string;
}

export const CompareBtn = memo(({ originalImage, editedImage }: CompareBtnProps) => {

  const handleCompare = () => {
    Modal.info({
      icon: null,
      footer: null,
      centered: true,
      title: null,
      content: <ImageTransition originalImage={originalImage} editedImage={editedImage} />,
      wrapClassName: 'image-comparison-modal',
      maskClosable: true,
    })
  }
  return (
    <Button variant="outline" size="icon" onClick={handleCompare}>
    <SquareSplitHorizontal className="h-4 w-4" />
  </Button>
  )
})