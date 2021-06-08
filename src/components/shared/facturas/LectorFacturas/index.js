import React from 'react';
import 'antd/dist/antd.css';
import { Upload, message, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const handleUpload = ({ file, onSuccess }) => {
    setTimeout(() => {
        onSuccess('ok');
    }, 0);
};

var reader = new FileReader();

const Index = ({
    isDragger,
    onSuccess,
    hideUploadList,
    titulo = 'Haga clic o arrastre un archivo a esta area para subirlo',
}) => {
    const props = {
        name: 'file',
        multiple: false,
        accept: '.xml',
        maxCount: 1,
        customRequest: handleUpload,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                reader.readAsText(info.fileList[0].originFileObj);

                if (!hideUploadList)
                    message.success(
                        `El archivo ${info.file.name} ha sido subido exitosamente.`
                    );
            } else if (status === 'error') {
                message.error(`Fallo al cargar el archivo ${info.file.name}.`);
            }
        },
    };
    reader.onload = function () {
        const result = reader.result;
        convertXMLtoObject(result); //base64encoded string
    };

    function convertXMLtoObject(xml) {
        var parseString = require('xml2js').parseString;
        parseString(xml, function (err, result) {
            onSuccess(result['cfdi:Comprobante']);
        });
    }

    return (
        <>
            {isDragger ? (
                <div>
                    <Dragger {...props} showUploadList={!hideUploadList}>
                        <p className='ant-upload-drag-icon'>
                            <InboxOutlined />
                        </p>
                        <p className='ant-upload-text'>{titulo}</p>
                        <p className='ant-upload-hint'>
                            Suba una factura en formato .XML para leer los datos
                            del comprobante.
                        </p>
                    </Dragger>
                </div>
            ) : (
                <Upload {...props} showUploadList={!hideUploadList}>
                    <Button icon={<UploadOutlined />}>{titulo}</Button>
                </Upload>
            )}
        </>
    );
};

export default Index;
