import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileWithPreview extends File {
  preview?: string;
}

export default function Compression() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic']
    }
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">图片压缩</h1>
      <p className="mb-8">通过我们的工具，您可以轻松地压缩图片，减少文件大小，提高加载速度。</p>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <div className="mb-4">
          <img src="/path-to-your-icon.png" alt="上传图标" className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg font-semibold">✨ 鼠标拖入图片文件或文件夹 ✨</p>
        </div>
        
        <div className="text-sm text-gray-600">
          <p className="mb-2">支持的图像格式</p>
          <p className="mb-1">PNG · JPEG · WebP · HEIC</p>
          <p className="text-xs">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Pro 用户独享</span>
          </p>
          <p className="mt-1">AVIF · TIFF · ICNS</p>
        </div>
      </div>
    </div>
  );
}
