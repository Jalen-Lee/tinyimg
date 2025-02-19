import {memo} from 'react';
import { Pagination } from 'antd';

export interface ToolbarPaginationProps {
  total: number;
  current: number;
  pageSize: number;
  onChange: (page: number,pageSize:number) => void;
}

export default memo(function ToolbarPagination(props:ToolbarPaginationProps) {
  const {total,current,pageSize,onChange} = props;

  return (
    <div className="p-1 bg-white rounded-xl border shadow-lg">
      <Pagination 
        defaultCurrent={current} 
        total={total} 
        pageSize={pageSize}
        onChange={onChange} 
      />
    </div>
  );
});
