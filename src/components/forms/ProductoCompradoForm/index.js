// import 'antd/dist/antd.css';
import './styles.css';
import React, { useEffect, useCallback, useState } from 'react';
import { Form, Input, Button, DatePicker, Typography, Select } from 'antd';
import { itemsToGrid } from 'utils/gridUtils';
import { getProductTitleCodePairs } from 'api/shared/products';

import moment from 'moment';
import locale from 'antd/es/date-picker/locale/es_ES';
import { useQuery } from 'react-query';

const { Item } = Form;
const { Title } = Typography;

const formatoFechaCompleta = 'DD MMMM YYYY, h:mm:ss a';
const formatoEntrega = 'DD-MM-YYYY';

const ProductoCompradoForm = ({
  datosProducto,
  submitText,
  onSubmit,
  cleanOnSubmit,
}) => {
  const { data: productos_catalogo } = useQuery(
    'productos_catalogo',
    async () => {
      const { data } = await getProductTitleCodePairs();
      const datos = data.data;
      return datos;
    }
  );

  const [form] = Form.useForm();

  const camposProducto = (
    <>
      <Item
        name='codigo'
        label='No. identificación en factura'
        tooltip='Número de identificación del producto, asignado por el proveedor.'
      >
        <Input disabled placeholder='No. identificación del proveedor' />
      </Item>
      <Item
        name='producto_catalogo'
        label='Código del producto relacionado'
        tooltip='Código del producto relacionado con el catálogo de la empresa.'
        rules={[
          {
            required: true,
            message: 'Campo requerido para la actualización de inventarios',
          },
        ]}
      >
        <Select placeholder='Código catálogo'>
          {productos_catalogo?.map((item, indx) => (
            <Select.Option value={item.codigo} key={indx}>
              {item.codigo + ' - ' + item.titulo}
            </Select.Option>
          ))}
        </Select>
      </Item>
      <Item
        name='clave'
        label='Clave'
        tooltip='Clave acorde al Catálogo de Productos y Servicios (c_ClaveProdServ) del SAT.'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled placeholder='Clave' />
      </Item>
      <Item
        name='descripcion'
        label='Descripción'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled placeholder='Descripción' />
      </Item>
      <Item
        name='cantidad'
        label='Cantidad comprada'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled placeholder='Cantidad comprada' />
      </Item>
      <Item
        name='cantidad_ingresada'
        label='Cantidad ingresada'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled placeholder='Cantidad ingresada' />
      </Item>
      <Item
        name='unidad'
        label='Unidad'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled placeholder='Unidad' />
      </Item>
      <Item
        name='descuento'
        label='Descuento'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled placeholder='Descuento' />
      </Item>
      <Item
        name='valor_unitario'
        label='Valor unitario'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled placeholder='Valor unitario' />
      </Item>
      <Item
        name='importe'
        label='Importe'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input disabled placeholder='Importe' />
      </Item>
    </>
  );

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
          format={formatoFechaCompleta}
          placeholder='Fecha de compra'
          style={{ width: '100%' }}
        />
      </Item>
      <Item name='fecha_entrega' label='Fecha de entrega'>
        <DatePicker
          disabled
          locale={locale}
          format={formatoEntrega}
          placeholder='Fecha de entrega'
          style={{ width: '100%' }}
        />
      </Item>
      <Item name='no_guia' label='Número de guía'>
        <Input disabled placeholder='Número de guía' maxLength={20} />
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
        <Input disabled placeholder='Razón social' />
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
    for (const dato in datosProducto) {
      let value = datosProducto[dato];
      if (dato.startsWith('fecha')) {
        if (dato === 'fecha_entrega') {
          value = value
            ? moment(new Date(value + 'T00:00:00'), formatoEntrega)
            : null;
        } else
          value = value ? moment(new Date(value), formatoFechaCompleta) : null;
      }
      changeFormValue({
        [dato]: value,
      });
    }
  }, [datosProducto, changeFormValue]);

  const onFinish = async (values) => {
    const success = await onSubmit(values);
    if (success && cleanOnSubmit) {
      form.resetFields();
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
      <Title level={5}>Datos del producto</Title>
      {itemsToGrid(camposProducto.props.children, 'auto', 2, 16)}
      <Title level={5}>Datos de compra</Title>
      {itemsToGrid(camposCompra.props.children, 'auto', 2, 16)}
      <Title level={5}>Datos del proveedor</Title>
      {itemsToGrid(camposProveedor.props.children, 'auto', 2, 16)}
      <Item>
        <Button type='primary' htmlType='submit'>
          {submitText}
        </Button>
      </Item>
    </Form>
  );
};

export default ProductoCompradoForm;
