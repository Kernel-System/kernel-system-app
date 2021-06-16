import React from 'react';
import { Select } from 'antd';

const index = ({ width = '100%', recentText, oldestText, ...props }) => {
  return (
    <Select style={{ width: width }} {...props}>
      <Select.Option value='recent'>{recentText}</Select.Option>
      <Select.Option value='oldest'>{oldestText}</Select.Option>
    </Select>
  );
};

const sortByRecent = (lista) =>
  lista.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
const sortByOldest = (lista) =>
  lista.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

export const sortData = (data, value) => {
  if (!data) return data;
  switch (value) {
    case 'recent':
      return sortByRecent(data);
    case 'oldest':
      return sortByOldest(data);
    default:
      return data;
  }
};

export default index;
