import { memo } from 'react';
import { Tag } from 'antd';

export interface ImgTagProps {
  type: string;
}

function ImgTag(props: ImgTagProps) {
  const { type } = props;
  switch (type) {
    case 'png':
      return <Tag bordered={false} color="blue">PNG</Tag>;
    case 'jpg':
      return <Tag bordered={false} color="green">JPG</Tag>;
    case 'jpeg':
      return <Tag bordered={false} color="green">JPEG</Tag>;
    case 'webp':
      return <Tag bordered={false} color="cyan">WEBP</Tag>;
    case 'avif':
      return <Tag bordered={false} color="purple">AVIF</Tag>;
    default:
      return null;
  }
}

export default memo(ImgTag);
