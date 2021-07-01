import { Modal, Button, Form } from 'antd';
import TextLabel from 'components/UI/TextLabel';

import React, { useEffect, useCallback } from 'react';
import 'antd/dist/antd.css';
import { Typography } from 'antd';

const { Item } = Form;
const { Title } = Typography;

const Index = ({ visible, codigo, setVis, onSubmit, datosProveedor }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    // Buscar con codigo
  }, []);

  const changeFormValue = useCallback(
    (value) => {
      form.setFieldsValue(value);
    },
    [form]
  );

  const onFinish = async (values) => {
    await onSubmit(values);
    //if (cleanOnSubmit) form.resetFields();
  };

  useEffect(() => {
    for (const dato in datosProveedor) {
      changeFormValue({
        [dato]: datosProveedor[dato],
      });
    }
  }, [datosProveedor, changeFormValue]);

  return (
    <>
      <Modal
        title={`Producto ${codigo}`}
        centered
        visible={visible}
        onOk={() => {
          setVis();
        }}
        onCancel={() => {
          setVis();
        }}
        width={'85%'}
        footer={[
          <Button
            key='submit'
            type='primary'
            onClick={() => {
              setVis();
            }}
          >
            Confirmar
          </Button>,
        ]}
      >
        <Form
          form={form}
          name='proveedor-form'
          layout='vertical'
          onFinish={onFinish}
        >
          <TextLabel title='Codigo' />
          <TextLabel title={'lel'} />
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Guardar cambios
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Index;
