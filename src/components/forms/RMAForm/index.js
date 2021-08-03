import 'antd/dist/antd.css';
import React, { useEffect, useCallback, useState } from 'react';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Typography,
  Select,
  message,
} from 'antd';
import { useQuery } from 'react-query';

import { getComprasRMA } from 'api/compras';
import { itemsToGrid } from 'utils/gridUtils';
import { estadoProductoRMA } from 'utils/almacen';

import moment from 'moment';
import locale from 'antd/es/date-picker/locale/es_ES';

import TablaProductosRMA from 'components/table/TablaProductosRMA';
import ModalProducto from './ModalProductoComprado';
import { useStoreState } from 'easy-peasy';

const { Item } = Form;
const { Option } = Select;
const { Title } = Typography;
const { Search } = Input;

const formatoFecha = 'DD MMMM YYYY, hh:mm:ss a';

const RMAForm = (props) => {
  const [form] = Form.useForm();
  const [productos, setProductos] = useState([]);
  const [productosComprados, setProductosComprados] = useState([]);
  const [productosCompradosMostrar, setProductosCompradosMostrar] = useState(
    []
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [keyCount, setKeyCount] = useState(0);
  const token = useStoreState((state) => state.user.token.access_token);

  const { data: compras } = useQuery(
    'compras-rma',
    async () => {
      const { data } = await getComprasRMA('recent', token);
      const datos = data.data;
      return datos;
    },
    {
      onSettled: (data) => {
        console.log('onSettled');
        const compraForm = form.getFieldValue('compra');
        const no_compra = props.datosRMA?.compra;
        console.log({ no_compra });
        console.log({ compraForm });
        if (no_compra && no_compra === compraForm) {
          console.log('change');
          onChangeCompra(no_compra, data, true);
        }
      },
    }
  );

  const changeFormValue = useCallback(
    (value) => {
      form.setFieldsValue(value);
    },
    [form]
  );

  function onChangeCompra(no_compra, listaCompras, conservarProductos) {
    const compra = listaCompras?.find(
      (compra) => compra.no_compra === no_compra
    );
    if (compra) {
      changeFormValue({
        fecha_compra: moment(new Date(compra.fecha_compra), formatoFecha),
        folio_factura: compra.factura.folio,
        serie_factura: compra.factura.serie,
        rfc: compra.proveedor.rfc,
        razon_social: compra.proveedor.razon_social,
        regimen_fiscal: compra.proveedor.regimen_fiscal,
        contacto: compra.proveedor.contacto,
      });
      conservarProductos ?? setProductos([]);
      setProductosComprados(compra.productos_comprados);
      setProductosCompradosMostrar(compra.productos_comprados);
    }
  }

  const onSearchChange = (value) => {
    buscarProductos(productosComprados, value);
  };

  const buscarProductos = (productos, value) => {
    if (productos) {
      const upperCaseValue = value.toUpperCase();
      setProductosCompradosMostrar(
        productosComprados.filter(
          (item) =>
            item.descripcion?.toUpperCase().includes(upperCaseValue) ||
            item.codigo?.toUpperCase().includes(upperCaseValue)
        )
      );
    }
  };

  const onSelectProductoComprado = (item) => {
    const producto = {
      key: keyCount,
      descripcion: item.descripcion,
      codigo: item.codigo,
      unidad: item.unidad,
      producto_comprado: item.id,
      serie: '',
      problema: '',
      estado_producto: 'pendiente_enviar',
    };
    const nuevosProductos = productos.slice();
    nuevosProductos.push(producto);
    setKeyCount(keyCount + 1);
    setProductos(nuevosProductos);
  };

  const verificarCampoProblema = (items) => {
    for (const item of items) {
      if (!item.problema?.length) return false;
    }
    return true;
  };

  const onFinish = async (values) => {
    if (verificarCampoProblema(productos)) {
      const rma = {
        ...values,
        productos_rma: productos,
      };
      console.log({ rma });
      const success = await props.onSubmit(rma);
      if (success && props.cleanOnSubmit) {
        form.resetFields();
        setProductos([]);
        setProductosComprados([]);
        setProductosCompradosMostrar([]);
      }
    } else {
      message.error('Describa el problema de cada producto');
    }
  };

  useEffect(() => {
    for (const dato in props.datosRMA) {
      if (dato === 'rfc' || dato === 'razon_social') continue;

      let value = props.datosRMA[dato];
      if (dato.startsWith('fecha')) {
        value = value ? moment(new Date(value), formatoFecha) : null;
      } else if (dato === 'productos_rma') {
        setProductos(
          value.map(({ producto_comprado, ...producto_rma }, index) => {
            const producto = {
              ...producto_rma,
              ...producto_comprado,
              producto_comprado: producto_comprado.id,
              estado_producto: producto_rma.estado,
              key: index,
            };
            // console.log({producto})
            return producto;
          })
        );
        setKeyCount(value.length);
      } else if (dato === 'compra' && compras?.length)
        onChangeCompra(value, compras, true);
      changeFormValue({
        [dato]: value,
      });
    }
    console.log('end of UseEffect');
  }, [props.datosRMA, changeFormValue]);

  const camposGenerales = (
    <>
      <Item
        name='folio'
        label='Folio RMA'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Input maxLength={50} placeholder='Folio RMA' />
      </Item>
      <Item
        name='fecha'
        label='Fecha'
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
          format={formatoFecha}
          placeholder='Fecha'
          style={{ width: '100%' }}
        />
      </Item>
      <Item
        name='estado'
        label='Estado'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Select disabled={!props.datosRMA.estado} placeholder='Estado'>
          <Option value='Abierto'>Abierto</Option>
          <Option value='Cerrado'>Cerrado</Option>
          );
        </Select>
      </Item>
    </>
  );
  const camposCompra = (
    <>
      <Item
        name='compra'
        label='No. Compra'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
      >
        <Select
          placeholder='No. Compra'
          onChange={(value) => onChangeCompra(value, compras)}
        >
          {compras?.map(({ no_compra, ...compra }) => {
            return (
              <Option key={no_compra} value={no_compra}>
                <b
                  style={{
                    opacity: 0.6,
                  }}
                >
                  {no_compra}
                </b>
                : comprado a{' '}
                <b
                  style={{
                    opacity: 0.6,
                  }}
                >
                  {compra.proveedor.rfc}
                </b>{' '}
                el{' '}
                <b
                  style={{
                    opacity: 0.6,
                  }}
                >
                  {moment(new Date(compra.fecha_compra)).format(formatoFecha)}
                </b>{' '}
                {/* -{' '}
                    {textoProductosPendientes(
                      totalProductosPendientes(compra.productos_comprados)
                    )} */}
              </Option>
            );
          })}
        </Select>
      </Item>
      <Item name='fecha_compra' label='Fecha de compra'>
        <DatePicker
          disabled
          locale={locale}
          format={formatoFecha}
          placeholder='Fecha de compra'
          style={{ width: '100%' }}
        />
      </Item>
      <Item name='folio_factura' label='Folio de factura'>
        <Input disabled placeholder='Folio de factura' />
      </Item>
      <Item name='serie_factura' label='Serie de factura'>
        <Input disabled placeholder='Serie de factura' />
      </Item>
    </>
  );
  const camposProveedor = (
    <>
      <Item name='rfc' label='RFC de proveedor'>
        <Input disabled placeholder='RFC de proveedor' />
      </Item>
      <Item name='razon_social' label='Razón social'>
        <Input disabled placeholder='Razón social' />
      </Item>
      <Item name='contacto' label='Contacto'>
        <Input disabled placeholder='Contacto' />
      </Item>
      <Item name='regimen_fiscal' label='Régimen fiscal'>
        <Input disabled placeholder='Régimen fiscal' />
      </Item>
    </>
  );

  return (
    <Form
      form={form}
      name='rma-form'
      layout='vertical'
      onFinish={onFinish}
      initialValues={{ estado: 'Abierto' }}
    >
      <Title level={5}>Datos generales</Title>
      {itemsToGrid(camposGenerales.props.children, 'auto', 2, 16)}
      <Title level={5}>Datos de compra</Title>
      {itemsToGrid(camposCompra.props.children, 'auto', 2, 16)}
      <Title level={5}>Datos del proveedor</Title>
      {itemsToGrid(camposProveedor.props.children, 'auto', 2, 16)}
      <Title level={5}>Productos</Title>
      <Item>
        <Search
          placeholder='Buscar productos comprados por código o descripción'
          allowClear
          enterButton='Buscar'
          onSearch={(value) => {
            onSearchChange(value);
            setModalVisible(true);
          }}
        />
      </Item>
      <ModalProducto
        lista={productosCompradosMostrar}
        visible={modalVisible}
        hide={() => setModalVisible(false)}
        onSelect={onSelectProductoComprado}
      />
      <TablaProductosRMA
        productos={productos}
        setProductos={setProductos}
        form={form}
        desabilitarEstado={
          props.datosRMA.estado === 'Cerrado' || props.datosRMA.id === undefined
        }
      ></TablaProductosRMA>
      <Item>
        <Button type='primary' htmlType='submit'>
          {props.submitText}
        </Button>
      </Item>
    </Form>
  );
};

export default RMAForm;
