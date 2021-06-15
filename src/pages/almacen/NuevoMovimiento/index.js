import {
  Input,
  Button,
  Typography,
  Form,
  Select,
  message,
  Row,
  Col,
  Table,
  InputNumber,
  Popconfirm,
  Image,
  Checkbox,
} from 'antd';
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import HeadingBack from 'components/UI/HeadingBack';
import TextLabel from 'components/UI/TextLabel';
import ModalProducto from 'components/transferencia/ModalTransferencia';
import { useHistory } from 'react-router';
import { http } from 'api';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useStoreState } from 'easy-peasy';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

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
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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
  const [facturas, setFacturas] = useState([]);
  const [tipo, setTipo] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [listProducts, setListProducts] = useState([]);
  const [listToShow, setListProductsToShow] = useState([]);
  const [empleado, setEmpleado] = useState('');
  const [devolucionesProv, setDevolucionesProv] = useState([]);
  const [devolucionesClientes, setDevolucionesClientes] = useState([]);
  const [ensambles, setEnsambles] = useState([]);
  const [transferencias, setTransferencias] = useState([]);
  const [compras, setCompras] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);

  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const [form] = Form.useForm();
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    http.get(`/users/me/?fields=*,empleado.*`, putToken).then((result) => {
      onSetArreglo(result.data.data.empleado[0], setEmpleado);
    });
    http
      .get(`/items/devoluciones_proveedores/?fields=folio`, putToken)
      .then((result) => {
        onSetArreglo(result.data.data, setDevolucionesProv);
      });
    http
      .get(`/items/info_devoluciones_clientes/?fields=id,diagnostico`, putToken)
      .then((result) => {
        onSetArreglo(result.data.data, setDevolucionesClientes);
      });
    http
      .get(
        `/items/ordenes_ensamble/?filter[estado][_neq]=Ingresado en almacén&fields=folio,descripcion`,
        putToken
      )
      .then((result) => {
        onSetArreglo(result.data.data, setEnsambles);
      });
    http
      .get(
        `/items/solicitudes_transferencia/?fields=id,almacen_origen,almacen_destino`,
        putToken
      )
      .then((result) => {
        onSetArreglo(result.data.data, setTransferencias);
      });
    http
      .get(
        `/items/solicitudes_transferencia/?fields=id,almacen_origen,almacen_destino`,
        putToken
      )
      .then((result) => {
        onSetArreglo(result.data.data, setTransferencias);
      });
    http
      .get(`/items/compras/?fields=no_compra,fecha_compra`, putToken)
      .then((result) => {
        onSetArreglo(result.data.data, setCompras);
      });
    http
      .get(`/items/ventas/?fields=no_venta,fecha_venta`, putToken)
      .then((result) => {
        onSetArreglo(result.data.data, setVentas);
      });
    http.get(`/items/almacenes/`, putToken).then((result) => {
      onSetArreglo(result.data.data, setAlmacenes);
    });
  }, []);

  const onSetArreglo = (lista, asignar) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    asignar(newLista);
  };

  const handleChangeTipo = (value) => {
    setTipo(value);
    setEnabled(false);
    const dir =
      value === 'facturas_internas'
        ? `/items/facturas_internas/`
        : `/items/facturas_externas/`;
    http.get(dir, putToken).then((resul) => {
      setFacturas(resul.data.data);
    });
  };

  const obtenerFecha = () => {
    const date = new Date();
    return (
      date.getUTCFullYear() +
      '-' +
      ('00' + (date.getUTCMonth() + 1)).slice(-2) +
      '-' +
      ('00' + date.getUTCDate()).slice(-2) +
      ' ' +
      ('00' + date.getUTCHours()).slice(-2) +
      ':' +
      ('00' + date.getUTCMinutes()).slice(-2) +
      ':' +
      ('00' + date.getUTCSeconds()).slice(-2)
    );
  };

  const switchVerificarConcepto = (concepto, values) => {
    switch (concepto) {
      case 'Compra':
        return values.compras !== '' && values.compras !== undefined;
      case 'Venta':
        return values.ventas !== '' && values.ventas !== undefined;
      case 'Devolución a cliente':
        return (
          values.devolucion_clientes !== '' &&
          values.devolucion_clientes !== undefined
        );
      case 'Regreso de mercancía':
        return values.rma !== '' && values.rma !== undefined;
      case 'Entrada por transferencia':
        return (
          values.no_transferencia !== '' &&
          values.no_transferencia !== undefined
        );
      case 'Salida por transferencia':
        return (
          values.no_transferencia !== '' &&
          values.no_transferencia !== undefined
        );
      case 'Entrada de componente defectuoso':
        return (
          values.folio_ensamble !== '' && values.folio_ensamble !== undefined
        );
      case 'Salida de componente para emsamble':
        return (
          values.folio_ensamble !== '' && values.folio_ensamble !== undefined
        );
      default:
        break;
    }
  };

  const onFinish = (values) => {
    if (switchVerificarConcepto(values.concepto, values)) {
      if (verificarSeriesProductos()) {
        http
          .post(
            `/items/movimientos_almacen/`,
            {
              fecha: obtenerFecha(),
              concepto: values.concepto,
              comentario: values.comentario,
              rma: values.rma,
              devolucion_clientes: values.devolucion_clientes,
              folio_ensamble: values.folio_ensamble,
              no_transferencia: values.no_transferencia,
              rfc_empleado: empleado.rfc,
              clave_almacen:
                empleado.puesto !== 'd5432f92-7a74-4372-907c-9868507e0fd5'
                  ? empleado.almacen
                  : values.almacen,
              compras: values.compras,
              ventas: values.ventas,
              mostrar: true,
            },
            putToken
          )
          .then((result) => {
            if (
              values.folio_factura !== undefined &&
              values.folio_factura !== ''
            ) {
              //movimientos_almacen_factura
              http.post(
                `/items/movimientos_almacen_factura/`,
                {
                  movimientos_almacen_id: result.data.data.id,
                  collection: tipo,
                  item: values.folio_factura,
                },
                putToken
              );
            }
            let productos = [];
            listProducts.map((producto) => {
              return productos.push({
                codigo: producto.codigo,
                clave: producto.clave,
                cantidad: producto.cantidad,
                descripcion: producto.titulo,
                clave_unidad: producto.clave_unidad,
                id_movimiento: result.data.data.id,
              });
            });
            http
              .post(`/items/productos_movimiento/`, productos, putToken)
              .then((result_productos) => {
                let series = [];
                let num = 0;
                listProducts.map((productos) => {
                  const idMov = result_productos.data.data[num].id;
                  num = num + 1;
                  productos.series.map((serie) => {
                    series.push({
                      serie: serie,
                      producto_movimiento: idMov,
                    });
                  });
                });
                http
                  .post(`/items/series_producto_movimiento/`, series, putToken)
                  .then((result_series) => {
                    agregarInventarios(values);
                  });
              });
          });
      } else {
        message.error('Falta de llenar datos en productos.');
      }
    } else {
      message.error('Falta de llenar una justificación.');
    }
  };

  const Mensaje = () => {
    message
      .success('La empleado ha sido registrada exitosamente', 3)
      .then(() => history.goBack());
  };

  const verificarSeriesProductos = () => {
    if (listProducts.length !== 0) {
      for (let i = 0; i < listProducts.length; i++) {
        if (listProducts[i].expand) {
          if (listProducts[i].series.length !== 0)
            for (let j = 0; j < listProducts[i].series.length; j++) {
              if (listProducts[i].series[j] === '') return false;
            }
          else return false;
        }
        if (listProducts.length - 1 === i) {
          return true;
        }
      }
    } else return false;
  };

  //+ Compra, Entrada por transferencia, Entrada de componente defectuoso
  //- Venta, Devolución a cliente, Regreso de mercancía, Salida por transferencia, Salida de componente para emsamble

  const sumar = (concepto) => {
    if (
      concepto === 'Compra' ||
      concepto === 'Entrada por transferencia' ||
      concepto === 'Entrada de componente defectuoso'
    ) {
      return true; //suma
    } else {
      return false; //resta
    }
  };

  const agregarInventarios = (values) => {
    let codigos = [];
    listProducts.map((producto) => {
      codigos.push(producto.codigo);
    });
    http
      .get(
        `/items/inventario?filter[codigo_producto][_in]=${codigos.toString()}&filter[clave_almacen][_eq]=${
          empleado.puesto !== 'd5432f92-7a74-4372-907c-9868507e0fd5'
            ? empleado.almacen
            : values.almacen
        }`,
        putToken
      )
      .then((inventario) => {
        let codigosInventario = [];
        inventario.data.data.map((elementoInventario) => {
          codigosInventario.push(elementoInventario.codigo_producto);
        });
        //del inventario
        let yaAgregados = codigos.filter((codigo) =>
          codigosInventario.includes(codigo)
        );
        //de productos
        let porAgregar = codigos.filter(
          (codigo) => !codigosInventario.includes(codigo)
        );
        let productosAgregados = listProducts.filter((producto) =>
          yaAgregados.includes(producto.codigo)
        );
        let productosPorAgregar = listProducts.filter((producto) =>
          porAgregar.includes(producto.codigo)
        );

        inventario.data.data.map((producto_inv, index) => {
          http
            .patch(
              `/items/inventario/${producto_inv.id}`,
              {
                cantidad: sumar(values.concepto)
                  ? producto_inv.cantidad + productosAgregados[index].cantidad
                  : producto_inv.cantidad - productosAgregados[index].cantidad,
                estado: 'normal',
                clave_almacen:
                  empleado.puesto !== 'd5432f92-7a74-4372-907c-9868507e0fd5'
                    ? empleado.almacen
                    : values.almacen,
                codigo_producto: productosAgregados[index].codigo,
              },
              putToken
            )
            .then((producto_inv_anl) => {
              if (sumar(values.concepto)) {
                let series = [];
                productosAgregados[index].series.map((serie) => {
                  series.push({
                    serie: serie,
                    inventario: producto_inv_anl.data.data.id,
                  });
                });
                http.post(`/items/series_inventario`, series, putToken);
              } else {
                let series = [];
                productosAgregados[index].series.map((serie) => {
                  series.push(serie);
                });
                http.delete(`/items/series_inventario`, series, putToken);
              }
            });
        });
        let mostrarMensaje = true;
        productosPorAgregar.map((producto, index) => {
          mostrarMensaje = false;
          http
            .post(
              `/items/inventario/`,
              {
                cantidad: producto.cantidad,
                estado: 'normal',
                clave_almacen:
                  empleado.puesto !== 'd5432f92-7a74-4372-907c-9868507e0fd5'
                    ? empleado.almacen
                    : values.almacen,
                codigo_producto: producto.codigo,
              },
              putToken
            )
            .then((producto_inv_anlf) => {
              let series = [];
              producto.series.map((serie) => {
                series.push({
                  serie: serie,
                  inventario: producto_inv_anlf.data.data.id,
                });
              });
              http
                .post(`/items/series_inventario`, series, putToken)
                .then(() => {
                  if (productosPorAgregar.length - 1 === index) {
                    Mensaje();
                  }
                });
            });
        });
        if (mostrarMensaje) {
          Mensaje();
        }
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.warn('Falta llenar datos');
  };

  //#region busqueda de productos
  const onSearchChange = (value) => {
    setSearchValue(value);
    filtrarProductosPorTitulo(data, value);
  };

  const filtrarProductosPorTitulo = async (productos, value) => {
    if (productos) {
      setListProductsToShow(
        productos.filter((item) => item.titulo.includes(value))
      );
    }
  };

  const fetchProducts = async () => {
    const { data } = await http.get(
      `/items/productos?fields=*,imagenes.directus_files_id`,
      putToken
    );
    return data.data;
  };

  const { data } = useQuery('productos', async () => {
    const result = await fetchProducts();
    setListProductsToShow(result);
    filtrarProductosPorTitulo(result, searchValue);
    return result;
  });

  const changeVisible = () => {
    setVisible(!visible);
  };
  //#endregion

  //#region Tabla informacion
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const changeSerie = (value, indice, actual) => {
    const lista = JSON.parse(JSON.stringify(listProducts));
    lista[indice].series[actual] = value;
    setListProducts(JSON.parse(JSON.stringify(lista)));
  };

  const inputs = (fila, numero, indice) => {
    const arreglo = Array.from(Array(numero).keys());
    const numeros = arreglo.map((actual) => {
      return (
        <Input
          key={`${fila.key}${actual}`}
          placeholder='Número de Serie'
          style={{ width: '100%', marginBottom: '10px' }}
          onBlur={(e) => {
            changeSerie(e.target.value, indice, actual);
          }}
          disabled={false}
        />
      );
    });
    return numeros;
  };

  const edit = (record) => {
    form.setFieldsValue({
      titulo: '',
      cantidad: '',
      expand: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...listProducts];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const cantidad = newData[index].cantidad;
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        if (row.cantidad < cantidad)
          newData[index].series.splice(cantidad - 2, row.cantidad);
        setListProducts(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setListProducts(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const changeCheck = async (key) => {
    const newData = JSON.parse(JSON.stringify(listProducts));
    const index = newData.findIndex((item) => key === item.key);
    newData[index].expand = !newData[index].expand;
    newData[index].series = [];
    setListProducts(newData);
  };

  const handleDelete = (key) => {
    const dataSource = [...listProducts];
    setListProducts(dataSource.filter((item) => item.key !== key));
  };

  const typeColumn = (type) => {
    switch (type) {
      case 'cantidad':
        return 'number';
      case 'image':
        return 'image';
      case 'expand':
        return null;
      default:
        return 'text';
    }
  };

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'image',
      width: '20px',
      //fixed: "left",
      render: (_, record) => <Image width={50} src={record.productimage} />,
      editable: false,
    },
    {
      title: 'NOMBRE',
      dataIndex: 'titulo',
      width: '70px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'CANTIDAD',
      dataIndex: 'cantidad',
      width: '30px',
      editable: true,
    },
    {
      title: '¿TIENE SERIE?',
      dataIndex: 'expand',
      width: '30px',
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <Checkbox
            onClick={() => {
              changeCheck(record.key);
            }}
            checked={record.expand}
            disabled={!editable}
          />
        );
      },
    },
    {
      title: '',
      dataIndex: 'operation',
      //fixed: breakpoint.lg ? "left": false,
      width: '50px',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type='link'
              onClick={() => save(record.key)}
              icon={<CheckOutlined />}
              style={{
                marginRight: 8,
              }}
            />
            <Popconfirm title='¿Estas seguro de cancelar?' onConfirm={cancel}>
              <CloseOutlined />
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Button
              icon={<EditOutlined />}
              type='link'
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              Editar
            </Button>
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
          inputType: typeColumn(col.dataIndex),
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    } else return col;
  });

  const addListItem = (item) => {
    const lista = JSON.parse(JSON.stringify(listProducts));
    lista.push({
      key: lista.length.toString(),
      expand: true,
      titulo: item.titulo,
      codigo: item.codigo,
      clave: item.clave,
      clave_unidad: item.unidad_cfdi,
      series: [],
      productimage:
        item.imagenes.length !== 0
          ? `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${item.imagenes[0].directus_files_id}`
          : '',
      cantidad: 1,
    });
    setListProducts(lista);
  };
  //#endregion

  return (
    <div>
      <Form
        name='nuevo_movimiento'
        initialValues={{ remember: true, concepto: 'Compra' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <HeadingBack title='Almacén' />
        <Title level={5}>Concepto</Title>
        <Form.Item
          key='concepto'
          name='concepto'
          rules={[
            {
              required: true,
              message: `Seleccione un concepto.`,
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: '50%' }}
            placeholder='Concepto'
            optionFilterProp='children'
            defaultValue='Compra'
          >
            <Option value='Compra'>Compra</Option>
            <Option value='Venta'>Venta</Option>
            <Option value='Devolución a cliente'>Devolución a cliente</Option>
            <Option value='Regreso de mercancía'>Regreso de mercancía</Option>
            <Option value='Entrada por transferencia'>
              Entrada por transferencia
            </Option>
            <Option value='Salida por transferencia'>
              Salida por transferencia
            </Option>
            <Option value='Entrada de componente defectuoso'>
              Entrada por transferencia
            </Option>
            <Option value='Salida de componente para emsamble'>
              Salida por transferencia
            </Option>
          </Select>
        </Form.Item>
        {empleado.puesto === 'd5432f92-7a74-4372-907c-9868507e0fd5' ? (
          <div>
            <Title level={5}>Almacén</Title>
            <Form.Item
              key='almacen'
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
                placeholder='Agrega un almacén.'
              >
                {almacenes.map((almacen) => (
                  <Option
                    value={almacen.clave}
                    key={almacen.clave}
                  >{`${almacen.clave} : ${almacen.clave_sucursal} `}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        ) : null}

        <Title level={4}>Justificación</Title>
        <Text type='secondary'>
          Debe llenar mínimo 1 de los campos a continuación.
        </Text>
        <Title level={5}>Número de Compra</Title>
        <Form.Item key='compras' name='compras'>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Agrega un Número de Devolución.'
            defaultValue=''
          >
            <Option key='' value=''>
              Ninguna
            </Option>
            {compras.map((compra) => {
              return (
                <Option key={compra.no_compra} value={compra.no_compra}>
                  {`${compra.no_compra} : ${compra.fecha_compra}`}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Title level={5}>Número de Venta</Title>
        <Form.Item key='ventas' name='ventas'>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Agrega un Número de Devolución.'
            defaultValue=''
          >
            <Option key='' value=''>
              Ninguna
            </Option>
            {ventas.map((venta) => {
              return (
                <Option key={venta.no_venta} value={venta.no_venta}>
                  {`${venta.no_venta} : ${venta.fecha_venta}`}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Title level={5}>Folio de RMA</Title>
        <Form.Item key='rma' name='rma'>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Agrega un folio de RMA.'
            defaultValue=''
          >
            <Option key='' value=''>
              Ninguna
            </Option>
            {devolucionesProv.map((dev) => {
              return (
                <Option key={dev.folio} value={dev.folio}>
                  {dev.folio}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Row key='columnas' gutter={[16, 8]}>
          <Col className='gutter-row' span={12}>
            <TextLabel title='Tipo de Factura' />
            <Form.Item key='tipo' name='tipo'>
              <Select
                //defaultValue='transferencia'
                style={{ width: '100%' }}
                onChange={handleChangeTipo}
              >
                <Option value='facturas_internas'>Facturas Internas</Option>
                <Option value='facturas_externas'>Facturas Externas</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className='gutter-row' span={12}>
            <Title level={5}>Número de Factura</Title>
            <Form.Item key='folio_factura' name='folio_factura'>
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder='Agrega un folio de factura.'
                disabled={enabled}
                defaultValue=''
              >
                <Option key='' value=''>
                  Ninguna
                </Option>
                {facturas.map((factura) => {
                  return tipo === 'facturas_internas' ? (
                    <Option key={factura.folio} value={factura.folio}>
                      {factura.folio}
                    </Option>
                  ) : (
                    <Option key={factura.id} value={factura.id}>
                      {`${factura.id} : ${factura.folio}`}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Title level={5}>Número de Devolución</Title>
        <Form.Item key='devolucion_clientes' name='devolucion_clientes'>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Agrega un Número de Devolución.'
            defaultValue=''
          >
            <Option key='' value=''>
              Ninguna
            </Option>
            {devolucionesClientes.map((dev) => {
              return (
                <Option key={dev.id} value={dev.id}>
                  {`${dev.id} : ${dev.diagnostico}`}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Title level={5}>Folio de Ensamble</Title>
        <Form.Item key='folio_ensamble' name='folio_ensamble'>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Agrega un Número de Devolución.'
            defaultValue=''
          >
            <Option key='' value=''>
              Ninguna
            </Option>
            {ensambles.map((ensamble) => {
              return (
                <Option key={ensamble.folio} value={ensamble.folio}>
                  {`${ensamble.folio} : ${ensamble.descripcion}`}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Title level={5}>Solicitud de Transferencia</Title>
        <Form.Item key='no_transferencia' name='no_transferencia'>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Agrega un Número de Transferencia.'
            defaultValue=''
          >
            <Option key='' value=''>
              Ninguna
            </Option>
            {transferencias.map((transferencia) => {
              return (
                <Option key={transferencia.id} value={transferencia.id}>
                  {`${transferencia.id} : ${transferencia.almacen_origen} a ${transferencia.almacen_destino}`}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Title level={5}>Comentario</Title>
        <Form.Item
          name='comentario'
          rules={[
            {
              required: false,
            },
          ]}
        >
          <TextArea
            //value={value}
            //placeholder='Controlled autosize'observaciones
            autoSize={{ minRows: 2, maxRows: 5 }}
            showCount
            maxLength={100}
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
        <Form form={form} component={false}>
          <Table
            defaultExpandAllRows={true}
            columnWidth='10px'
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            expandable={{
              expandedRowRender: (record) => (
                <div style={{ margin: 0 }}>
                  <Title level={5}>Series</Title>
                  {inputs(record, record.cantidad, record.key)}
                </div>
              ),
              rowExpandable: (record) => record.expand,
            }}
            scroll={{ x: 1000, y: 600 }}
            dataSource={listProducts}
            columns={mergedColumns}
            rowClassName='editable-row'
            /*pagination={{
          onChange: cancel,
        }}*/
          />
        </Form>
        <br />
        <Form.Item name='boton'>
          <Button
            style={{ margin: '0 auto', display: 'block' }}
            type='primary'
            htmlType='submit'
          >
            Realizar Movimiento
          </Button>
        </Form.Item>
      </Form>
      <ModalProducto
        lista={listToShow}
        visible={visible}
        setVis={changeVisible}
        onSelection={addListItem}
      />
    </div>
  );
};

export default Index;
