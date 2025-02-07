import { useState, useCallback } from 'react';
import SelectFile from './select-file';
import ProcessFile from './process-file';
import useCompressionStore from '@/store/compression';
import useSelector from '@/hooks/useSelector';

export default function Compression() {
  const {
    hasSelected,
  } = useCompressionStore(useSelector(['hasSelected']))


  return (
    <div className="h-full w-full">
      {hasSelected ? <ProcessFile /> : <SelectFile />}
    </div>
  );
}
