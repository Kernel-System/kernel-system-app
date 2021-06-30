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

const sortByRecent = (lista, field) =>
  lista.sort((a, b) => new Date(b[field]) - new Date(a[field]));
const sortByOldest = (lista, field) =>
  lista.sort((a, b) => new Date(a[field]) - new Date(b[field]));

export const sortData = (data, value, field = 'fecha') => {
  if (!data) return data;
  switch (value) {
    case 'recent':
      return sortByRecent(data, field);
    case 'oldest':
      return sortByOldest(data, field);
    default:
      return data;
  }
};

export default index;
