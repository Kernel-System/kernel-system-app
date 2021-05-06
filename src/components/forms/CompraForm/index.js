import React, { useEffect, useCallback } from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button, DatePicker, Typography, Select } from 'antd';

import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';

import { itemsToGrid } from 'utils/gridUtils';
import { formasDePago, metodosDePago } from 'utils/facturas/catalogo';

const { Item } = Form;
const { Option } = Select;
const { Title } = Typography;

const dateFormat = 'DD MMMM YYYY, h:mm:ss a';

const Index = (props) => {
  const [form] = Form.useForm();

  const camposGeneral = (
    <>
      <Item
        name='rfc_proveedor'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled placeholder='RFC de proveedor' />
      </Item>
      <Item name='guia'>
        <Input placeholder='Número de guía' />
      </Item>
      <Item
        name='fecha_compra'
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
      <Item name='fecha_entrega'>
        <DatePicker
          locale={locale}
          format={dateFormat}
          placeholder='Fecha de entrega'
          style={{ width: '100%' }}
        />
      </Item>

      <Item
        name='moneda'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled placeholder='Moneda' />
      </Item>
      <Item name='tipo_cambio'>
        <Input placeholder='Tipo de cambio' />
      </Item>
      <Item
        name='subtotal'
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

  const changeFormValue = useCallback(
    (value) => {
      form.setFieldsValue(value);
    },
    [form]
  );

  useEffect(() => {
    for (const dato in props.datosCompra) {
      let value = props.datosCompra[dato];
      if (dato === 'fecha_compra')
        value = value === '' ? null : moment(value, dateFormat);
      changeFormValue({
        [dato]: value,
      });
    }
  }, [props.datosCompra, changeFormValue]);

  return (
    <Form form={form} name='compra-form'>
      {itemsToGrid(camposGeneral.props.children, 'auto', 2, 8, 16)}
      <Title level={4}>Productos</Title>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          {props.submitText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Index;
