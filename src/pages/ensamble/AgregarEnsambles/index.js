import AddProduct from 'components/ensamble/AddProduct';
import { useState } from 'react';
import { Typography, Input, Space, Button, Form, Select, message } from 'antd';
import { useHistory } from 'react-router';
import HeadingBack from 'components/UI/HeadingBack';
import { http } from 'api';
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Index = () => {
  const history = useHistory();
  const [list, setList] = useState({
    descripcion: '',
    observaciones: '',
    rfc_empleado_ensamble: '',
    codigo_ensamble: '',
    estado: 'Ordenado',
    productos:
      //{ codigo: '', cantidad: 0, descripcion: '' }
      [],
  });

  const changeProducts = (element) => {
    const lista = JSON.parse(JSON.stringify(list));
    lista.productos = element;
    console.log(lista);
    setList(JSON.parse(JSON.stringify(lista)));
  };

  const changeElements = (value, title) => {
    const lista = JSON.parse(JSON.stringify(list));
    lista[title] = value;
    setList(JSON.parse(JSON.stringify(lista)));
  };

  const onFinish = () => {
    /*http
      .post('/items/movimientos_almacen', {
        fecha: obtenerFecha(),
        concepto: 'Componente de ensamble',
        comentario: list.observaciones,
        folio_ensamble: result_ens.data.data.folio,
        rfc_empleado: 'Empleado de Almacen',
        clave_almacen: 1,
        mostrar: false,
      })
      .then((result_mov) => {});*/

    http
      .post('/items/ordenes_ensamble', {
        fecha_orden: new Date().toLocaleDateString(),
        fecha_inicio_ensamble: null,
        fecha_fin_ensamble: null,
        estado: 'Ordenado',
        descripcion: list.descripcion,
        observaciones: list.observaciones,
        codigo_ensamble: list.codigo_ensamble,
        rfc_empleado_ensamble: list.rfc_empleado_ensamble,
        rfc_empleado_orden: 'Empleado Actual',
      })
      .then((result_ens) => {
        const lista = JSON.parse(JSON.stringify(list.productos));
        let productos = [];
        //let productosMovimiento = [];
        list.productos.map((producto) => {
          productos.push({
            codigo: producto.codigo,
            cantidad: producto.cantidad,
            descripcion: producto.descripcion,
            orden_ensamble: result_ens.data.data.folio,
          });
          /*productosMovimiento.push({
            codigo: producto.codigo,
            clave: '',
            cantidad: producto.cantidad,
            descripcion: producto.descripcion,
            unidad: '',
            clave_unidad: '',
            nota: '',
            id_movimiento: '1',
          });*/
        });
        console.log(productos);
        http.post('/items/componentes_ensamble', productos).then((result2) => {
          message
            .success('El ensamble ha sido registrados exitosamente', 3)
            .then(() => history.goBack());
        });
      });
    console.log('Success:', list);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name='basic'
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <HeadingBack title='Nuevo Ensamble' />
      <Title level={5}>Componente a ensamblar</Title>
      <Form.Item
        name='codigo_ensamble'
        rules={[
          {
            required: true,
            message: `Asigna un codigo`,
          },
        ]}
      >
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder='Buscando producto a ensamblar'
          optionFilterProp='children'
          //onChange={onChange}
          //onFocus={onFocus}
          onChange={(value) => {
            changeElements(value, 'codigo_ensamble');
          }}
          //onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().iOf(input.toLowerCase()) >= 0
          }
        >
          <Option value='Producto 1'>Compu 1</Option>
          <Option value='Producto 2'>Compu 2</Option>
        </Select>
      </Form.Item>
      <Title level={5}>Empleado de Ensamble</Title>
      <Form.Item
        name='ensamblador asignado'
        rules={[
          {
            required: true,
            message: `Asigna un Empleado`,
          },
        ]}
      >
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder='Buscar empleado'
          optionFilterProp='children'
          //onChange={onChange}
          //onFocus={onFocus}
          onChange={(value) => {
            changeElements(value, 'rfc_empleado_ensamble');
          }}
          //onSearch={onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().iOf(input.toLowerCase()) >= 0
          }
        >
          <Option value='RFC 1'>Juan</Option>
          <Option value='RFC 2'>Pedro</Option>
        </Select>
      </Form.Item>
      <AddProduct
        titulo='Componentes'
        tag='componentes'
        onChanged={changeProducts}
      />
      <Title level={5}>Descripción</Title>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Form.Item
          name='descripcion'
          rules={[
            {
              required: true,
              message: `Asigna un(a) descripción`,
            },
          ]}
        >
          <TextArea
            //value={value}
            //placeholder='Controlled autosize'
            onBlur={(e) => {
              changeElements(e.target.value, 'descripcion');
            }}
            autoSize={{ minRows: 2, maxRows: 5 }}
            showCount
            maxLength={100}
            style={{ fontSize: '20' }}
          />
        </Form.Item>
        <Title level={5}>Observaciones</Title>
        <Form.Item
          name='observacion'
          rules={[
            {
              required: false,
            },
          ]}
        >
          <TextArea
            //value={value}
            //placeholder='Controlled autosize'observaciones
            onBlur={(e) => {
              changeElements(e.target.value, 'observaciones');
            }}
            autoSize={{ minRows: 2, maxRows: 5 }}
            showCount
            maxLength={100}
            style={{ fontSize: '20' }}
          />
        </Form.Item>
      </Space>
      <Form.Item name='boton'>
        <Button
          style={{ margin: '0 auto', display: 'block' }}
          type='primary'
          htmlType='submit'
        >
          Crear Orden de Ensamble
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Index;
