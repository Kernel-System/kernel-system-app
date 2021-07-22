import { DeleteOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Table,
  Typography,
} from 'antd';
import { http } from 'api';
import ModalProducto from 'components/ordenCompra/ModalProductosProv';
import HeadingBack from 'components/UI/HeadingBack';
import TextLabel from 'components/UI/TextLabel';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
const { Search, TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =
    inputType === 'number' ? <InputNumber min={0} /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Index = () => {
  const [proveedor, setProveedor] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [empleado, setEmpleado] = useState();
  const [listProducts, setListProducts] = useState([]);
  const [normalList, setNormalList] = useState([]);
  const [listToShow, setListProductsToShow] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [total, setTotal] = useState(0);
  const [iva, setIva] = useState(0);

  const history = useHistory();
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    http
      .get(
        `/items/proveedores?fields=*,compras.*,compras.productos_comprados.codigo,compras.productos_comprados.clave,compras.productos_comprados.descripcion,compras.productos_comprados.unidad,compras.productos_comprados.valor_unitario`,
        putToken
      )
      .then((resul) => {
        onSetDato(resul.data.data, setProveedores);
      });
    http.get(`/users/me/?fields=*,empleado.*`, putToken).then((result) => {
      onSetDato(result.data.data.empleado[0], setEmpleado);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetDato = (lista, setDato) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    console.log(newLista);
    setDato(newLista);
  };

  const onFinish = (datos) => {
    if (verificarProductos()) {
      http
        .post(
          '/items/ordenes_compra/',
          {
            subtotal: (total - iva).toFixed(2),
            iva: iva.toFixed(2),
            total: total.toFixed(2),
            nota: datos.nota,
            rfc_empleado: empleado.rfc,
            rfc_proveedor: proveedor.rfc,
          },
          putToken
        )
        .then((result) => {
          let productos = [];
          listProducts.forEach((producto) => {
            productos.push({
              codigo_prov: producto.codigo_prov,
              cve_sat: producto.cve_sat,
              descripcion: producto.descripcion,
              unidad: producto.unidad,
              descuento: producto.descuento,
              cantidad: producto.cantidad,
              precio_unitario: producto.precio_unitario,
              total: producto.total,
              orden_compra: result.data.data.folio,
            });
          });
          http
            .post('/items/productos_ordenes_compra', productos, putToken)
            .then(() => {
              Mensaje();
            });
        });
    } else {
      message.error('Error en la tabla de productos');
    }
  };

  const verificarProductos = () => {
    let entrar = true;
    const lista = JSON.parse(JSON.stringify(listProducts));

    lista.forEach((producto) => {
      if (
        !producto.codigo_prov ||
        !producto.cve_sat ||
        !producto.descripcion ||
        !producto.unidad ||
        producto.cantidad === 0 ||
        producto.precio_unitario === 0
      ) {
        entrar = false;
      }
    });
    return entrar;
  };

  const Mensaje = () => {
    message
      .success('La orden de compra ha sido creada exitosamente', 3)
      .then(() => history.goBack());
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onChangeProveedor = (value, index) => {
    const ind = proveedores.find((ind) => ind.rfc === value);
    console.log(ind);
    setProveedor(ind);
  };

  //#region busqueda de productos
  const onSearchChange = (value) => {
    setSearchValue(value);
    filtrarProductosPorTitulo(normalList, value);
  };

  useEffect(() => {
    onSetProductosProveedor();
  }, [proveedor]);

  const onSetProductosProveedor = () => {
    setListProducts([]);
    setListProductsToShow([]);
    setNormalList([]);
    if (
      proveedor?.compras !== undefined &&
      proveedor?.compras !== null &&
      proveedor?.compras?.length !== 0
    ) {
      let newProductos = [];
      proveedor.compras.forEach((compra) => {
        compra.productos_comprados.forEach((producto) => {
          if (
            newProductos.indexOf(producto) === -1 &&
            producto.unidad.toUpperCase() !== 'SERVICIO'
          ) {
            newProductos.push(producto);
          }
        });
      });
      console.log(newProductos);
      setNormalList(newProductos);
      filtrarProductosPorTitulo(newProductos, '');
    }
  };

  const filtrarProductosPorTitulo = async (productos, value) => {
    if (value === '') {
      setListProductsToShow(productos);
    } else if (productos) {
      setListProductsToShow(
        productos.filter((item) => item.titulo.includes(value))
      );
    }
  };

  const changeVisible = () => {
    setVisible(!visible);
  };
  //#endregion

  //#region Tabla informacion
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const handleDelete = (key) => {
    const dataSource = [...listProducts];
    setListProducts(dataSource.filter((item) => item.key !== key));
  };

  const changeServicio = (value, key, tag) => {
    const newData = JSON.parse(JSON.stringify(listProducts));
    const index = newData.findIndex((item) => key === item.key);
    newData[index][tag] = value;
    if (tag === 'cantidad' || tag === 'precio_unitario') {
      newData[index].total = (
        newData[index].precio_unitario * newData[index].cantidad
      ).toFixed(2);
    }
    setListProducts(newData);
  };

  useEffect(() => {
    onSetTotal();
  }, [listProducts]);

  const onSetTotal = () => {
    const total = listProducts
      .map((dato) => parseFloat(dato.total))
      .reduce((a, b) => a + b, 0);
    setTotal(total * 1.16);
    setIva(total * 0.16);
  };

  const typeColumn = (type) => {
    switch (type) {
      case 'number':
        return 'number';
      case 'image':
        return 'image';
      default:
        return 'text';
    }
  };

  const columns = [
    {
      title: 'CODIGO-PROV',
      dataIndex: 'codigo_prov',
      width: '25px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
      render: (_, record) => {
        return (
          <Input
            key={record.key}
            //size='large'
            style={{ width: '100%' }}
            defaultValue={record.codigo_prov}
            onBlur={(e) => {
              changeServicio(e.target.value, record.key, 'codigo_prov');
            }}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            step='0.01'
          />
        );
      },
    },
    {
      title: 'CVE-SAT',
      dataIndex: 'cve_sat',
      width: '22px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
      render: (_, record) => {
        return (
          <InputNumber
            min={0}
            key={record.key}
            //size='large'
            style={{ width: '100%' }}
            defaultValue={record.cve_sat}
            onBlur={(e) => {
              changeServicio(e.target.value, record.key, 'cve_sat');
            }}
            step='1'
          />
        );
      },
    },
    {
      title: 'DESCRIPCIÓN',
      dataIndex: 'descripcion',
      width: '50px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
      render: (_, record) => {
        return (
          <Input
            key={record.key}
            //size='large'
            style={{ width: '100%' }}
            defaultValue={record.descripcion}
            onBlur={(e) => {
              changeServicio(e.target.value, record.key, 'descripcion');
            }}
          />
        );
      },
    },
    {
      title: 'Unidad.',
      dataIndex: 'unidad',
      width: '25px',
      //fixed: 'left',
      ellipsis: true,
      render: (_, record) => {
        return (
          <input
            key={record.key}
            //size='large'
            style={{ width: '100%' }}
            defaultValue={record.unidad}
            onBlur={(e) => {
              changeServicio(e.target.value, record.key, 'unidad');
            }}
          />
        );
      },
    },
    {
      title: 'CANTIDAD',
      dataIndex: 'cantidad',
      type: 'number',
      width: '20px',
      editable: true,
      render: (_, record) => {
        return (
          <InputNumber
            min={0}
            key={record.key}
            //size='large'
            style={{ width: '100%' }}
            defaultValue={record.cantidad}
            onBlur={(e) => {
              changeServicio(e.target.value, record.key, 'cantidad');
            }}
            step='0.01'
          />
        );
      },
    },
    {
      title: 'P.UNITARIO',
      dataIndex: 'precio_unitario',
      width: '25px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
      render: (_, record) => {
        return (
          <InputNumber
            min={0}
            key={record.key}
            //size='large'
            style={{ width: '100%' }}
            defaultValue={record.precio_unitario}
            onBlur={(e) => {
              changeServicio(
                e.target.value.replace(/\$\s?|(,*)/g, ''),
                record.key,
                'precio_unitario'
              );
            }}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            step='0.01'
          />
        );
      },
    },
    {
      title: 'TOTAL',
      dataIndex: 'total',
      width: '30px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
      render: (_, record) => {
        return <Text>{record.total}</Text>;
      },
    },
    {
      title: '',
      dataIndex: 'operation',
      //fixed: breakpoint.lg ? "left": false,
      width: '10px',
      render: (_, record) => {
        return (
          <span>
            <Popconfirm
              title='¿Estas seguro de querer eliminar?'
              onConfirm={() => handleDelete(record.key)}
            >
              <DeleteOutlined />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    if (col.dataIndex !== 'expand') {
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: typeColumn(col.type),
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    } else return col;
  });

  const addListItem = (item) => {
    const lista = JSON.parse(JSON.stringify(listProducts));
    const dato = lista.findIndex(
      (producto) => producto.descripcion === item.descripcion
    );
    console.log(item);
    if (dato === -1)
      lista.push({
        key: lista.length.toString(),
        codigo_prov: item.codigo,
        cve_sat: item.clave,
        descripcion: item.descripcion,
        unidad: item.unidad,
        cantidad: 0,
        precio_unitario: item.valor_unitario,
        total: 0,
      });
    else lista[dato] = { ...lista[dato], cantidad: lista[dato].cantidad + 1 };
    setListProducts(lista);
  };

  const addNullListItem = () => {
    const lista = JSON.parse(JSON.stringify(listProducts));
    lista.push({
      key: lista.length.toString(),
      codigo_prov: '',
      cve_sat: '',
      descripcion: '',
      unidad: '',
      cantidad: 0,
      precio_unitario: 0,
      total: 0,
    });
    setListProducts(lista);
  };

  //#endregion

  const formatPrice = (price) => {
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return formatter.format(price);
  };

  return (
    <Form
      name='basic'
      key='1'
      initialValues={{
        remember: true,
        cliente: 'nulo',
        porcentaje: 0,
        dias: 1,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <HeadingBack title='Orden de Compra' />
      <TextLabel title='Proveedor' />
      <Form.Item
        key='proveedor'
        name='proveedor'
        rules={[
          {
            required: true,
            message: `Seleccione un concepto.`,
          },
        ]}
      >
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder='Concepto'
          optionFilterProp='children'
          onChange={(value, index) => {
            onChangeProveedor(value, index);
          }}
        >
          {proveedores.map((proveedor) => (
            <Option key={proveedor.rfc} value={proveedor.rfc}>
              {`${proveedor.rfc} : ${proveedor.razon_social}`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <TextLabel title='Nota' />
      <Form.Item name='nota' key='nota'>
        <TextArea
          //value={value}
          //placeholder='Controlled autosize'
          autoSize={{ minRows: 2, maxRows: 5 }}
          showCount
          maxLength={150}
          style={{ fontSize: '20' }}
        />
      </Form.Item>
      <Title level={5}>Productos</Title>
      <Search
        placeholder='Ingrese nombre del producto.'
        allowClear
        enterButton='Buscar'
        onSearch={(value) => {
          onSearchChange(value);
          setVisible(!visible);
        }}
      />
      <br />
      <br />
      <Button
        type='primary'
        shape='round'
        onClick={() => {
          addNullListItem();
        }}
      >
        Agregar Fila
      </Button>
      <Form form={form} component={false}>
        <Table
          columnWidth='10px'
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          scroll={{ x: 1500, y: 600 }}
          dataSource={listProducts}
          columns={mergedColumns}
          rowClassName='editable-row'
          /*pagination={{
          onChange: cancel,
        }}*/
        />
      </Form>
      <br />
      <Row
        key='Row'
        gutter={[16, 24]}
        style={{ marginBottom: '10px', width: '100%' }}
        align='middle'
        justify='center'
      >
        <Col className='gutter-row' span={8}>
          <TextLabel
            title='SUBTOTAL'
            subtitle={formatPrice((total - iva).toFixed(2))}
          />
        </Col>
        <Col className='gutter-row' span={8}>
          <TextLabel title='IVA' subtitle={formatPrice(iva.toFixed(2))} />
        </Col>
        <Col className='gutter-row' span={8}>
          <TextLabel title='TOTAL' subtitle={formatPrice(total.toFixed(2))} />
        </Col>
      </Row>
      <Form.Item>
        <Button
          style={{ margin: '0 auto', display: 'block' }}
          type='primary'
          htmlType='submit'
          size='large'
        >
          Crear Cotización
        </Button>
      </Form.Item>
      <ModalProducto
        lista={listToShow}
        visible={visible}
        setVis={changeVisible}
        onSelection={addListItem}
      />
    </Form>
  );
};

export default Index;
