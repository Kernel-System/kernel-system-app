import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { http } from 'api';
import HeadingBack from 'components/UI/HeadingBack';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Index = () => {
  const history = useHistory();
  const [products, setProduct] = useState([]);
  const [productsEns, setProductEns] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [creador, setCreador] = useState('');
  const [almacenes, setAlmacenes] = useState([]);
  const [almacen, setAlmacen] = useState(1);
  const breakpoint = useBreakpoint();

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
    http.get(`/items/almacenes/`, putToken).then((result) => {
      onChangeDato(result.data.data, setAlmacenes);
    });
    http.get(`/items/productos/`, putToken).then((result) => {
      onChangeDato(result.data.data, setProductEns);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    http
      .get(`/items/productos?fields=*,inventario.*`, putToken)
      .then((result) => {
        onSetProductos(result.data.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [almacen]);

  const onSetProductos = (lista) => {
    const newData = JSON.parse(JSON.stringify(lista));
    const newProductos = [];
    console.log({ almacen: almacen });
    lista.forEach((producto, index) => {
      let inventarios = [];
      producto.inventario.forEach((inventario) => {
        if (inventario.clave_almacen === almacen && inventario.cantidad !== 0)
          inventarios.push(inventario);
      });
      if (inventarios.length !== 0) {
        newData[index].inventario = inventarios;
        newProductos.push(newData[index]);
      }
    });
    console.log(newProductos);
    setList({
      ...list,
      productos: [
        {
          id: 0,
          codigo: '',
          cantidad: 0,
          descripcion: '',
          clave: '',
          clave_unidad: '',
        },
      ],
    });
    setProduct(newProductos);
  };

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
    productos: [
      {
        id: 0,
        codigo: '',
        cantidad: 0,
        descripcion: '',
        clave: '',
        clave_unidad: '',
      },
    ],
  });

  const changeElements = (value, title) => {
    const lista = JSON.parse(JSON.stringify(list));
    lista.productos[title] = value;
    setList(JSON.parse(JSON.stringify(lista)));
  };

  const pushFila = () => {
    const rows = JSON.parse(JSON.stringify(list));
    rows.productos.push({
      id: rows.productos.length,
      codigo: '',
      cantidad: 0,
      descripcion: '',
      clave: '',
      clave_unidad: '',
    });
    setList(JSON.parse(JSON.stringify(rows)));
  };

  const popFila = () => {
    const rows = JSON.parse(JSON.stringify(list));
    rows.productos.pop();
    setList(JSON.parse(JSON.stringify(rows)));
  };

  const onChangeNumber = (id, value) => {
    const rows = JSON.parse(JSON.stringify(list));
    rows.productos[id] = {
      ...rows.productos[id],
      cantidad: value,
    };
    setList(JSON.parse(JSON.stringify(rows)));
  };

  const changeProduct = (id, value, descripcion, key) => {
    const rows = JSON.parse(JSON.stringify(list));
    rows.productos[id] = {
      id: id,
      codigo: value,
      cantidad: 1,
      descripcion: descripcion,
      clave: products[key].clave,
      max: products[key].inventario
        .map((inventario) => inventario.cantidad)
        .reduce((cantidad, sum) => cantidad + sum, 0),
      clave_unidad: products[key].unidad_cfdi,
    };
    setList(JSON.parse(JSON.stringify(rows)));
  };

  const onFinish = (values) => {
    const hide = message.loading('Generando Ensamble...', 0);
    http
      .post(
        '/items/ordenes_ensamble',
        {
          fecha_orden: new Date().toLocaleDateString(),
          fecha_inicio_ensamble: null,
          fecha_fin_ensamble: null,
          estado: 'Ordenado',
          descripcion: values.descripcion,
          observaciones: values.observaciones,
          codigo_ensamble: values.codigo_ensamble,
          rfc_empleado_ensamble: values.rfc_empleado_ensamble,
          rfc_empleado_orden: creador.rfc,
          clave_almacen: almacen,
        },
        putToken
      )
      .then((result_ens) => {
        let productos = [];
        //let productosMovimiento = [];
        list.productos.forEach((producto) => {
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
            hide();
            message
              .success('El ensamble ha sido registrados exitosamente', 3)
              .then(() => history.goBack());
          });
      });
    console.log('Success:', list);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onSetAlmacen = (value) => {
    setAlmacen(value);
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
          {productsEns.map((product) => (
            <Option
              value={product.codigo}
              key={product.codigo}
            >{`${product.codigo} : ${product.titulo}`}</Option>
          ))}
        </Select>
      </Form.Item>
      <Title level={5}>Empleado de Ensamble</Title>
      <Form.Item
        name='rfc_empleado_ensamble'
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
      <Title level={5}>Almac??n</Title>
      <Form.Item
        name='almacen'
        rules={[
          {
            required: true,
            message: `Seleccione un almacen.`,
          },
        ]}
      >
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder='Almac??n'
          onChange={(value) => {
            onSetAlmacen(value);
          }}
        >
          {almacenes.map((almacen) => (
            <Option value={almacen.clave} key={almacen.clave}>
              <b
                style={{
                  opacity: 0.6,
                }}
              >
                {almacen.clave}
              </b>
              : de sucursal{' '}
              <b
                style={{
                  opacity: 0.6,
                }}
              >
                {almacen.clave_sucursal}
              </b>
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Title level={5}>Componentes</Title>
      {list.productos.map((fila) => (
        <Row key={fila.id} gutter={[4]} style={{ marginBottom: '5px' }}>
          <Col span={breakpoint.lg ? 12 : 24}>
            <Row key={fila.id} gutter={[4]}>
              <Col xs={16} lg={16}>
                <Form.Item
                  name={`$componente${fila.id}`}
                  rules={[
                    {
                      required: true,
                      message: `Asigna un componente`,
                    },
                  ]}
                >
                  <Select
                    showSearch
                    key={fila.id}
                    style={{ width: '100%' }}
                    placeholder='Buscar producto por c??digo'
                    optionFilterProp='children'
                    onChange={(value, index) =>
                      changeProduct(fila.id, value, index.children, index.key)
                    }
                    //onFocus={onFocus}
                    //onBlur={onBlur}
                    //onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {products.map((product, index) => (
                      <Option
                        value={product.codigo}
                        key={index}
                      >{`${product.codigo} : ${product.titulo}`}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={8} lg={8}>
                <InputNumber
                  min={1}
                  max={fila.max}
                  defaultValue={1}
                  onChange={(value) => onChangeNumber(fila.id, value)}
                  disabled={
                    list.productos[fila.id].codigo !== '' ? false : true
                  }
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </Col>
          <Col span={breakpoint.lg ? 12 : 24}>
            <Input
              placeholder='N??mero de Serie'
              style={{ width: '100%' }}
              disabled={true}
            />
          </Col>
        </Row>
      ))}
      <Space align='center'>
        <Button
          type='link'
          icon={<PlusCircleOutlined />}
          onClick={() => pushFila()}
        >
          A??adir
        </Button>
        <Button
          type='link'
          icon={<MinusCircleOutlined />}
          danger
          disabled={list.length === 1 ? true : false}
          onClick={() => popFila()}
        >
          Remover
        </Button>
      </Space>
      <Title level={5}>Descripci??n</Title>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Form.Item
          name='descripcion'
          rules={[
            {
              required: true,
              message: `Asigna un(a) descripci??n`,
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
