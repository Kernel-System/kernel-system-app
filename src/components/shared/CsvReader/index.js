import React from 'react';
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { csvToArray } from 'utils';

const handleUpload = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};
var reader = new FileReader();

const index = ({ text, onSuccess, hideMessage }) => {
  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.csv',
    maxCount: 1,
    headers: {
      authorization: 'authorization-text',
    },
    customRequest: handleUpload,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        reader.readAsText(info.fileList[0].originFileObj);

        if (!hideMessage)
          message.success(
            `El archivo ${info.file.name} ha sido subido exitosamente.`
          );
      } else if (status === 'error') {
        message.error(`Fallo al subir el archivo ${info.file.name}.`);
      }
    },
  };

  reader.onload = function () {
    const result = reader.result;
    const data = csvToArray(result);

    onSuccess(data);
  };

  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>{text}</Button>
    </Upload>
  );
};

export default index;
