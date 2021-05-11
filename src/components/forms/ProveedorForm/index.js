import React, { useEffect, useCallback } from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button } from 'antd';
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
        ]}
      >
        <Input placeholder='RFC' />
      </Item>
      <Form.Item name='nombre' label='Nombre'>
        <Input placeholder='Nombre' />
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
        <Input placeholder='Régimen fiscal' />
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
        <Input placeholder='Razón social' />
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
        <Input placeholder='Correo' />
      </Form.Item>
      <Form.Item name='sucursal' label='Sucursal'>
        <Input placeholder='Sucursal' />
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
        <Input placeholder='Teléfono 1' />
      </Form.Item>
      <Form.Item name='telefono_2' label='Teléfono 2'>
        <Input placeholder='Teléfono 2' />
      </Form.Item>
      <Form.Item name='tipo' label='Tipo'>
        <Input placeholder='Tipo' />
      </Form.Item>
      <Form.Item name='categoria' label='Categoría'>
        <Input placeholder='Categoría' />
      </Form.Item>
      <Form.Item name='necesita_orden_compra' label='Necesita Orden de Compra'>
        <Input placeholder='Necesita Orden de Compra' />
      </Form.Item>
      <Form.Item name='comentarios' label='Comentarios'>
        <Input placeholder='Comentarios' />
      </Form.Item>
    </>
  );
  const camposCuenta = (
    <>
      <Form.Item name='cuenta_contable' label='Cuenta contable'>
        <Input placeholder='Cuenta contable' />
      </Form.Item>
      <Form.Item name='banco' label='Banco'>
        <Input placeholder='Banco' />
      </Form.Item>
      <Form.Item name='cuenta' label='Cuenta'>
        <Input placeholder='Cuenta' />
      </Form.Item>
      <Form.Item name='dias_credito' label='Días crédito'>
        <Input placeholder='Días crédito' />
      </Form.Item>
      <Form.Item name='monto_credito' label='Monto crédito'>
        <Input placeholder='Monto crédito' />
      </Form.Item>
    </>
  );
  const camposDomicilio = (
    <>
      <Form.Item name='calle' label='Calle'>
        <Input placeholder='Calle' />
      </Form.Item>
      <Form.Item name='entre_calle_1' label='Entre calle 1'>
        <Input placeholder='Entre calle 1' />
      </Form.Item>
      <Form.Item name='entre_calle_2' label='Entre calle 2'>
        <Input placeholder='Entre calle 2' />
      </Form.Item>
      <Form.Item name='no_interior' label='No. interior'>
        <Input placeholder='No. interior' />
      </Form.Item>
      <Form.Item name='no_exterior' label='No. exterior'>
        <Input placeholder='No. exterior' />
      </Form.Item>
      <Form.Item name='cp' label='C.P'>
        <Input placeholder='C.P' />
      </Form.Item>
      <Form.Item name='localidad' label='Localidad'>
        <Input placeholder='Localidad' />
      </Form.Item>
      <Form.Item name='municipio' label='Municipio'>
        <Input placeholder='Municipio' />
      </Form.Item>
      <Form.Item name='estado' label='Estado'>
        <Input placeholder='Estado' />
      </Form.Item>
      <Form.Item name='pais' label='País'>
        <Input placeholder='País' />
      </Form.Item>
    </>
  );

  const changeFormValue = useCallback(
    (value) => {
      form.setFieldsValue(value);
    },
    [form]
  );

  useEffect(() => {
    console.log('Se ejecutó');
    for (const dato in props.datosProveedor) {
      changeFormValue({
        [dato]: props.datosProveedor[dato],
      });
    }
  }, [props.datosProveedor, changeFormValue]);

  return (
    <>
      <Form form={form} name='proveedor-form' layout='vertical'>
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
