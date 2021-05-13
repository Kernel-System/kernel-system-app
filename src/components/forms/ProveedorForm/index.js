import React, { useEffect, useCallback } from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button, InputNumber, Switch } from 'antd';
import { Typography } from 'antd';

import { itemsToGrid } from 'utils/gridUtils';

const { Item } = Form;
const { Title } = Typography;

const Index = (props) => {
  const [form] = Form.useForm();

  const camposGeneral = (
    <>
      <Item
        name='rfc'
        label='RFC'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
          {
            pattern:
              '[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]',
            message: 'Ingrese un RFC válido.',
          },
        ]}
      >
        <Input maxLength={13} placeholder='RFC' />
      </Item>
      <Form.Item name='nombre' label='Nombre'>
        <Input maxLength={254} placeholder='Nombre' />
      </Form.Item>
      <Form.Item
        name='regimen_fiscal'
        label='Régimen fiscal'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input minLength={2} maxLength={3} placeholder='Régimen fiscal' />
      </Form.Item>
      <Form.Item
        name='razon_social'
        label='Razón social'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input maxLength={254} placeholder='Razón social' />
      </Form.Item>
      <Form.Item
        name='correo'
        label='Correo'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input type='email' placeholder='Correo' />
      </Form.Item>
      <Form.Item name='sucursal' label='Sucursal'>
        <Input maxLength={254} placeholder='Sucursal' />
      </Form.Item>
      <Form.Item
        name='telefono'
        label='Teléfono 1'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <InputNumber
          min={1000000000}
          max={9999999999}
          placeholder='Teléfono 1'
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item name='telefono_2' label='Teléfono 2'>
        <InputNumber
          min={1000000000}
          max={9999999999}
          placeholder='Teléfono 2'
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item
        name='tipo'
        label='Tipo'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input maxLength={45} placeholder='Tipo' />
      </Form.Item>
      <Form.Item
        name='categoria'
        label='Categoría'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input maxLength={45} placeholder='Categoría' />
      </Form.Item>
      <Form.Item name='comentarios' label='Comentarios'>
        <Input maxLength={100} placeholder='Comentarios' />
      </Form.Item>
      <Form.Item
        name='necesita_orden_compra'
        label='Necesita Orden de Compra'
        valuePropName='checked'
      >
        <Switch />
      </Form.Item>
    </>
  );
  const camposCuenta = (
    <>
      <Form.Item name='cuenta_contable' label='Cuenta contable'>
        <Input placeholder='Cuenta contable' />
      </Form.Item>
      <Form.Item name='banco' label='Banco'>
        <Input maxLength={100} placeholder='Banco' />
      </Form.Item>
      <Form.Item
        name='cuenta'
        label='Cuenta'
        rules={[
          {
            pattern: '[A-Z0-9_]{10,50}',
            message: 'Ingrese un número de cuenta válido.',
          },
        ]}
      >
        <Input maxLength={50} placeholder='Cuenta' />
      </Form.Item>
      <Form.Item name='dias_credito' label='Días crédito'>
        <InputNumber
          min={0}
          max={999}
          placeholder='Días crédito'
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item name='monto_credito' label='Monto crédito'>
        <InputNumber
          min={0}
          max={9999999}
          placeholder='Monto crédito'
          precision={2}
          style={{ width: '100%' }}
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) => value.replace(/\$?|(,*)/g, '')}
        />
      </Form.Item>
    </>
  );
  const camposDomicilio = (
    <>
      <Form.Item
        name='calle'
        label='Calle'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input placeholder='Calle' maxLength={200} />
      </Form.Item>
      <Form.Item name='entre_calle_1' label='Entre calle 1'>
        <Input placeholder='Entre calle 1' maxLength={200} />
      </Form.Item>
      <Form.Item name='entre_calle_2' label='Entre calle 2'>
        <Input placeholder='Entre calle 2' maxLength={200} />
      </Form.Item>
      <Form.Item name='no_int' label='No. interior'>
        <Input placeholder='No. interior' maxLength={7} />
      </Form.Item>
      <Form.Item
        name='no_ext'
        label='No. exterior'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <InputNumber
          placeholder='No. exterior'
          min={0}
          max={9999999}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item
        name='colonia'
        label='Colonia'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input placeholder='Colonia' maxLength={200} />
      </Form.Item>
      <Form.Item
        name='cp'
        label='C.P'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <InputNumber
          placeholder='C.P'
          min={0}
          max={99999}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item
        name='localidad'
        label='Localidad'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input placeholder='Localidad' maxLength={150} />
      </Form.Item>
      <Form.Item
        name='municipio'
        label='Municipio'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input placeholder='Municipio' maxLength={150} />
      </Form.Item>
      <Form.Item
        name='estado'
        label='Estado'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input placeholder='Estado' maxLength={45} />
      </Form.Item>
      <Form.Item
        name='pais'
        label='País'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input placeholder='País' maxLength={100} />
      </Form.Item>
    </>
  );

  const changeFormValue = useCallback(
    (value) => {
      form.setFieldsValue(value);
    },
    [form]
  );

  const onFinish = async (values) => {
    await props.onSubmit(values);
    if (props.cleanOnSubmit) form.resetFields();
  };

  useEffect(() => {
    for (const dato in props.datosProveedor) {
      changeFormValue({
        [dato]: props.datosProveedor[dato],
      });
    }
  }, [props.datosProveedor, changeFormValue]);

  return (
    <>
      <Form
        form={form}
        name='proveedor-form'
        layout='vertical'
        onFinish={onFinish}
      >
        <Title level={5}>General</Title>
        {itemsToGrid(camposGeneral.props.children, 'auto', 2, 16)}
        <Title level={5}>Info. de cuenta</Title>
        {itemsToGrid(camposCuenta.props.children, 'auto', 2, 16)}
        <Title level={5}>Domicilio</Title>
        {itemsToGrid(camposDomicilio.props.children, 'auto', 2, 16)}
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            {props.submitText}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Index;
