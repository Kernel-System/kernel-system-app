import React, { useEffect, useCallback } from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button } from 'antd';
import { Typography } from 'antd';
import { Row, Col } from 'antd';

const { Item } = Form;
const { Title } = Typography;

const itemsToGrid = (array, nRows, nCols, colSpan, horizGutter) => {
  const grid = [];
  let index = 0;
  let rowIdx = 0;

  while (rowIdx < nRows || nRows === 'auto') {
    if (index >= array.length) break;

    let colIdx = 0;
    const cols = [];

    while (colIdx < nCols) {
      const element = array[index];
      cols.push(
        <Col xs={colSpan * nCols} xl={colSpan} key={colIdx}>
          {element}
        </Col>
      );

      colIdx++;
      index++;
    }

    const row = (
      <Row gutter={[horizGutter]} key={rowIdx}>
        {cols}
      </Row>
    );
    grid.push(row);
    rowIdx++;
  }
  return grid;
};

const Index = (props) => {
  const [form] = Form.useForm();

  const camposGeneral = (
    <>
      <Item
        name='rfc'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input placeholder='RFC' />
      </Item>
      <Form.Item name='nombre'>
        <Input placeholder='Nombre' />
      </Form.Item>
      <Form.Item
        name='regimen_fiscal'
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
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input placeholder='Correo' />
      </Form.Item>
      <Form.Item name='sucursal'>
        <Input placeholder='Sucursal' />
      </Form.Item>
      <Form.Item
        name='telefono'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input placeholder='Teléfono 1' />
      </Form.Item>
      <Form.Item name='telefono_2'>
        <Input placeholder='Teléfono 2' />
      </Form.Item>
      <Form.Item name='tipo'>
        <Input placeholder='Tipo' />
      </Form.Item>
      <Form.Item name='categoria'>
        <Input placeholder='Categoría' />
      </Form.Item>
      <Form.Item name='necesita_orden_compra'>
        <Input placeholder='Necesita Orden de Compra' />
      </Form.Item>
      <Form.Item name='comentarios'>
        <Input placeholder='Comentarios' />
      </Form.Item>
    </>
  );
  const camposCuenta = (
    <>
      <Form.Item name='cuenta_contable'>
        <Input placeholder='Cuenta contable' />
      </Form.Item>
      <Form.Item name='banco'>
        <Input placeholder='Banco' />
      </Form.Item>
      <Form.Item name='cuenta'>
        <Input placeholder='Cuenta' />
      </Form.Item>
      <Form.Item name='dias_credito'>
        <Input placeholder='Días crédito' />
      </Form.Item>
      <Form.Item name='monto_credito'>
        <Input placeholder='Monto crédito' />
      </Form.Item>
    </>
  );
  const camposDomicilio = (
    <>
      <Form.Item name='calle'>
        <Input placeholder='Calle' />
      </Form.Item>
      <Form.Item name='entre_calle_1'>
        <Input placeholder='Entre calle 1' />
      </Form.Item>
      <Form.Item name='entre_calle_2'>
        <Input placeholder='Entre calle 2' />
      </Form.Item>
      <Form.Item name='no_interior'>
        <Input placeholder='No. interior' />
      </Form.Item>
      <Form.Item name='no_exterior'>
        <Input placeholder='No. exterior' />
      </Form.Item>
      <Form.Item name='cp'>
        <Input placeholder='C.P' />
      </Form.Item>
      <Form.Item name='localidad'>
        <Input placeholder='Localidad' />
      </Form.Item>
      <Form.Item name='municipio'>
        <Input placeholder='Municipio' />
      </Form.Item>
      <Form.Item name='estado'>
        <Input placeholder='Estado' />
      </Form.Item>
      <Form.Item name='pais'>
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
      <Title level={2}>Datos del proveedor</Title>
      <Form form={form} name='proveedor-form'>
        <Title level={4}>General</Title>
        {itemsToGrid(camposGeneral.props.children, 'auto', 2, 8, 16)}
        <Title level={4}>Info. de cuenta</Title>
        {itemsToGrid(camposCuenta.props.children, 'auto', 2, 8, 16)}
        <Title level={4}>Domicilio</Title>
        {itemsToGrid(camposDomicilio.props.children, 'auto', 2, 8, 16)}
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
