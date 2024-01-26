import React from 'react';
import { Pagination } from 'antd';

export const PaginationBlock = ({ page, setPage, articlesCount }) => {
  return (
    <div className="pagination-app">
      <Pagination
        defaultCurrent={page}
        showSizeChanger={false}
        total={articlesCount}
        onChange={(p) => setPage(p)}
      />
    </div>
  );
};
