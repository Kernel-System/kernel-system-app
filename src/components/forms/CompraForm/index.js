import React, { useEffect, useCallback, useState } from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button, DatePicker, Typography, Select } from 'antd';

import moment from 'moment';
import locale from 'antd/es/date-picker/locale/es_ES';
import ProductosTable from 'components/table/ProductosTable';

import { itemsToGrid } from 'utils/gridUtils';
import { formasDePago, metodosDePago } from 'utils/facturas/catalogo';

const { Item } = Form;
const { Option } = Select;
const { Title } = Typography;

const dateFormat = 'DD MMMM YYYY, h:mm:ss a';
const formatoEntrega = 'DD-MM-YYYY';

const Index = (props) => {
  const [form] = Form.useForm();

  const camposCompra = (
    <>
      <Item
        name='fecha_compra'
        label='Fecha de compra'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <DatePicker
          disabled
          locale={locale}
          format={dateFormat}
          placeholder='Fecha de compra'
          style={{ width: '100%' }}
        />
      </Item>
      <Item name='fecha_entrega' label='Fecha de entrega'>
        <DatePicker
          locale={locale}
          format={formatoEntrega}
          placeholder='Fecha de entrega'
          style={{ width: '100%' }}
        />
      </Item>
      <Item name='no_guia' label='Número de guía'>
        <Input placeholder='Número de guía' maxLength={20} />
      </Item>
    </>
  );

  const camposFactura = (
    <>
      <Item
        name='moneda'
        label='Moneda'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled placeholder='Moneda' />
      </Item>
      <Item name='tipo_cambio' label='Tipo de cambio'>
        <Input disabled placeholder='Tipo de cambio' />
      </Item>
      <Item
        name='subtotal'
        label='Subtotal'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled placeholder='Subtotal' />
      </Item>
      <Item
        name='total'
        label='Monto total'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled placeholder='Monto total' />
      </Item>
      <Item
        name='forma_pago'
        label='Forma de pago'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Select disabled placeholder='Forma de pago'>
          <Option value='' selected disabled>
            Seleccione la forma de pago
          </Option>
          {Object.keys(formasDePago).map((item) => {
            return (
              <Option value={item} key={item}>
                {formasDePago[item]}
              </Option>
            );
          })}
        </Select>
      </Item>
      <Item
        name='metodo_pago'
        label='Metodo de pago'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Select disabled placeholder='Metodo de pago'>
          <Option value='' selected disabled>
            Seleccione el método de pago
          </Option>
          {Object.keys(metodosDePago).map((item) => {
            return (
              <Option value={item} key={item}>
                {metodosDePago[item]}
              </Option>
            );
          })}
        </Select>
      </Item>
    </>
  );

  const camposProveedor = (
    <>
      <Item
        name='rfc_emisor'
        label='RFC de proveedor'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled placeholder='RFC de proveedor' />
      </Item>
      {/* <Form.Item name='contacto' label='Contacto'>
            <Input maxLength={150} placeholder='Contacto' />
          </Form.Item> */}
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
        <Input
          disabled
          minLength={2}
          maxLength={3}
          placeholder='Régimen fiscal'
        />
      </Form.Item>
      <Form.Item
        name='nombre_emisor'
        label='Razón social'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled maxLength={254} placeholder='Razón social' />
      </Form.Item>
    </>
  );

  const [productos, setProductos] = useState([]);

  const changeFormValue = useCallback(
    (value) => {
      form.setFieldsValue(value);
    },
    [form]
  );

  useEffect(() => {
    for (const dato in props.datosCompra) {
      let value = props.datosCompra[dato];
      if (dato.startsWith('fecha')) {
        if (dato === 'fecha_entrega') {
          value = value
            ? moment(new Date(value + 'T00:00:00'), formatoEntrega)
            : null;
        } else value = value ? moment(new Date(value), dateFormat) : null;
      }
      if (dato === 'productos_comprados') {
        setProductos(value.map((val, indx) => ({ ...val, key: indx })));
      }
      changeFormValue({
        [dato]: value,
      });
    }
  }, [props.datosCompra, changeFormValue]);

  const onFinish = async (values) => {
    const success = await props.onSubmit(values);
    if (success && props.cleanOnSubmit) {
      form.resetFields();
      setProductos([]);
    }
  };

  return (
    <Form
      form={form}
      name='compra-form'
      layout='vertical'
      requiredMark='optional'
      onFinish={onFinish}
    >
      <Title level={4}>Datos de compra</Title>
      {itemsToGrid(camposCompra.props.children, 'auto', 2, 16)}
      <Title level={5}>Datos de factura</Title>
      {itemsToGrid(camposFactura.props.children, 'auto', 2, 16)}
      <Title level={5}>Datos del proveedor</Title>
      {itemsToGrid(camposProveedor.props.children, 'auto', 2, 16)}
      <Title level={5}>Productos</Title>
      <ProductosTable productos={productos}></ProductosTable>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          {props.submitText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Index;
