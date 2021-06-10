import AddProduct from 'components/ensamble/AddProduct';
import { useState, useEffect } from 'react';
import { Typography, Input, Space, Button, Form, Select, message } from 'antd';
import { useHistory } from 'react-router';
import HeadingBack from 'components/UI/HeadingBack';
import { http } from 'api';
import { useStoreState } from 'easy-peasy';
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Index = () => {
  const history = useHistory();
  const [products, setProduct] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [creador, setCreador] = useState('');
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    http.get(`/users/me/?fields=*,empleado.*`, putToken).then((result) => {
      onChangeDato(result.data.data.empleado[0], setCreador);
      console.log(result.data.data.empleado[0]);
      http
        .get(
          `/items/empleados?filter[puesto][_eq]=3afe4f4d-7125-45d5-ba57-402221ef956d`, //&filter[almacen][_eq]=${result.data.data.empleado[0].almacen}
          putToken
        )
        .then((result2) => {
          console.log(result2.data.data);
          onChangeDato(result2.data.data, setEmpleados);
        });
    });
    http.get(`/items/productos/`, putToken).then((result) => {
      onChangeDato(result.data.data, setProduct);
    });
  }, []);

  const onChangeDato = (lista, setDato) => {
    const newData = JSON.parse(JSON.stringify(lista));
    setDato(newData);
  };

  const [list, setList] = useState({
    descripcion: '',
    observaciones: '',
    rfc_empleado_ensamble: '',
    codigo_ensamble: '',
    estado: 'Ordenado',
    productos: [],
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
    http
      .post(
        '/items/ordenes_ensamble',
        {
          fecha_orden: new Date().toLocaleDateString(),
          fecha_inicio_ensamble: null,
          fecha_fin_ensamble: null,
          estado: 'Ordenado',
          descripcion: list.descripcion,
          observaciones: list.observaciones,
          codigo_ensamble: list.codigo_ensamble,
          rfc_empleado_ensamble: list.rfc_empleado_ensamble,
          rfc_empleado_orden: creador.rfc,
          clave_almacen: creador.almacen,
        },
        putToken
      )
      .then((result_ens) => {
        let productos = [];
        //let productosMovimiento = [];
        list.productos.map((producto) => {
          productos.push({
            codigo: producto.codigo,
            clave: producto.clave,
            cantidad: producto.cantidad,
            clave_unidad: producto.clave_unidad,
            descripcion: producto.descripcion,
            orden_ensamble: result_ens.data.data.folio,
          });
        });
        console.log(productos);
        http
          .post('/items/componentes_ensamble', productos, putToken)
          .then((result2) => {
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
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {products.map((product) => (
            <Option
              value={product.codigo}
              key={product.codigo}
            >{`${product.codigo} : ${product.titulo}`}</Option>
          ))}
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
          placeholder='Buscar empleado por RFC'
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
          {empleados.map((empleado) => (
            <Option
              value={empleado.rfc}
              key={empleado.rfc}
            >{`${empleado.rfc} : ${empleado.nombre}`}</Option>
          ))}
        </Select>
      </Form.Item>
      <AddProduct
        titulo='Componentes'
        tag='componentes'
        onChanged={changeProducts}
        products={products}
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
