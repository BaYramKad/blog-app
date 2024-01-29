import { Spin } from 'antd';
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

export const Spinner = () => {
  return (
    <div className="atricle-spin">
      <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
    </div>
  );
};
