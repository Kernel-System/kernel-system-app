import { DeleteOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Image,
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
import ModalProducto from 'components/transferencia/ModalTransferencia';
import HeadingBack from 'components/UI/HeadingBack';
import TextLabel from 'components/UI/TextLabel';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { conceptosMovimientos } from 'utils/almacen';
import { itemsToGrid } from 'utils/gridUtils';

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
  const [factura, setFactura] = useState('');
  const [tipo, setTipo] = useState('');
  const [enabled, setEnabled] = useState(true);
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
  const [productos, setProductos] = useState([]);
  const [almacen, setAlmacen] = useState('1');
  const [concepto, setConcepto] = useState('Compra');

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
      if (
        result.data.data.empleado[0].puesto ===
        'd5432f92-7a74-4372-907c-9868507e0fd5'
      ) {
        onSetAlmacen(1);
      } else {
        onSetAlmacen(result.data.data.empleado[0].almacen);
      }
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
      .get(`/items/compras/?fields=*,productos_comprados.*`, putToken)
      .then((result) => {
        console.log(result.data.data);
        onSetArreglo(result.data.data, setCompras);
      });
    http.get(`/items/ventas/?fields=*`, putToken).then((result) => {
      onSetArreglo(result.data.data, setVentas);
    });
    http.get(`/items/almacenes/`, putToken).then((result) => {
      onSetArreglo(result.data.data, setAlmacenes);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetAlmacen = (value) => {
    setAlmacen(value);
  };

  useEffect(() => {
    http
      .get(
        `/items/productos?fields=*,imagenes.directus_files_id,inventario.*`,
        putToken
      )
      .then((result) => {
        onSetProductos(result.data.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [almacen, concepto]);

  const onSetProductos = (lista) => {
    const newData = JSON.parse(JSON.stringify(lista));
    const newProductos = [];
    lista.forEach((producto, index) => {
      let inventarios = [];
      producto.inventario.forEach((inventario) => {
        if (sumar(concepto)) {
          inventarios.push(inventario);
        } else if (
          inventario.clave_almacen === almacen &&
          inventario.cantidad !== 0
        )
          inventarios.push(inventario);
      });
      if (inventarios.length !== 0 || sumar(concepto)) {
        newData[index].inventario = inventarios;
        newProductos.push(newData[index]);
      }
    });
    setProductos(newProductos);
    setListProducts([]);
    setListProductsToShow(newProductos);
  };

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
      case 'Devolución a proveedor':
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
      case 'Componente defectuoso':
        return (
          values.folio_ensamble !== '' && values.folio_ensamble !== undefined
        );
      case 'Componente para ensamble':
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
            let productosCoV = [];
            listProducts.forEach((producto) => {
              productos.push({
                codigo: producto.codigo,
                clave: producto.clave,
                cantidad: producto.cantidad,
                titulo: producto.titulo,
                clave_unidad: producto.clave_unidad,
                id_movimiento: result.data.data.id,
              });
              if (concepto === 'Compra')
                productosCoV.push({
                  id: producto.id,
                  cantidad: producto.cantidad,
                });
            });
            console.log(productosCoV);
            if (concepto === 'Compra')
              http.post(
                '/custom/productos-compras/',
                { productos: productosCoV },
                putToken
              );
            http
              .post(`/items/productos_movimiento/`, productos, putToken)
              .then((result_productos) => {
                let series = [];
                let num = 0;
                listProducts.forEach((productos) => {
                  const idMov = result_productos.data.data[num].id;
                  num = num + 1;
                  productos.series.forEach((serie) => {
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
      .success('El movimiento ha sido registrado exitosamente', 3)
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

  const onChangeCompra = (all) => {
    setTipo('facturas_externas');
    console.log(compras[all.index]);
    if (compras[all.index]?.factura !== undefined) {
      const catalogos = [];

      compras[all.index].productos_comprados.forEach((producto) => {
        if (producto.producto_catalogo !== null) {
          catalogos.push(producto);
        }
      });
      console.log(catalogos);
      let lista = [];
      catalogos.forEach((producto) => {
        lista.push({
          key: lista.length.toString(),
          expand: true,
          titulo: producto.descripcion,
          codigo: producto.producto_catalogo,
          id: producto.id,
          clave: producto.clave,
          clave_unidad: producto.clave_unidad,
          series: [],
          max: 10,
          productimage: '',
          cantidad: 1,
        });
      });
      setListProducts(JSON.parse(JSON.stringify(lista)));
      setFactura(compras[all.index].factura);
    } else {
      setFactura('');
    }
  };

  //+ Compra, Entrada por transferencia, Componente defectuoso
  //- Venta, Devolución a cliente, Devolución a proveedor, Salida por transferencia, Componente para ensamble

  const sumar = (concepto) => {
    if (
      concepto === 'Compra' ||
      concepto === 'Entrada por transferencia' ||
      concepto === 'Componente defectuoso'
    ) {
      return true; //suma
    } else {
      return false; //resta
    }
  };

  const agregarInventarios = (values) => {
    let codigos = [];
    listProducts.forEach((producto) => {
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
        inventario.data.data.forEach((elementoInventario) => {
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

        inventario.data.data.forEach((producto_inv, index) => {
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
                productosAgregados[index].series.forEach((serie) => {
                  series.push({
                    serie: serie,
                    inventario: producto_inv_anl.data.data.id,
                  });
                });
                http.post(`/items/series_inventario`, series, putToken);
              } else {
                let series = [];
                productosAgregados[index].series.forEach((serie) => {
                  series.push(serie);
                });
                http.delete(`/items/series_inventario`, series, putToken);
              }
            });
        });
        let mostrarMensaje = true;
        productosPorAgregar.forEach((producto, index) => {
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
              producto.series.forEach((serie) => {
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

  const onFinishFailed = (errorInfo) => {
    message.warn('Falta llenar datos');
  };

  //#region busqueda de productos
  const onSearchChange = (value) => {
    filtrarProductosPorTitulo(productos, value);
  };

  const filtrarProductosPorTitulo = async (productos, value) => {
    if (productos) {
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
      //case 'cantidad':
      //return 'number';
      case 'image':
        return 'image';
      case 'expand':
        return null;
      default:
        return 'text';
    }
  };

  const onChangeCantidad = (value, index) => {
    if (value !== 0) {
      const newData = JSON.parse(JSON.stringify(listProducts));
      const cantidad = newData[index].cantidad;
      if (value < cantidad) newData[index].series.splice(cantidad - 2, value);
      newData[index].cantidad = value;
      setListProducts(newData);
      setEditingKey('');
      setListProducts(newData);
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
      render: (_, record) => {
        if (sumar(concepto)) {
          return (
            <InputNumber
              min={1}
              defaultValue={record.cantidad}
              onChange={(value) => {
                onChangeCantidad(value, record.key);
              }}
            />
          );
        } else {
          return (
            <InputNumber
              max={record.max}
              min={1}
              defaultValue={record.cantidad}
              onChange={(value) => {
                onChangeCantidad(value, record.key);
              }}
            />
          );
        }
      },
      editable: true,
    },
    {
      title: '¿TIENE SERIE?',
      dataIndex: 'expand',
      width: '30px',
      editable: true,
      render: (_, record) => {
        return (
          <Checkbox
            onClick={() => {
              changeCheck(record.key);
            }}
            checked={record.expand}
          />
        );
      },
    },
    {
      title: '',
      dataIndex: 'operation',
      //fixed: breakpoint.lg ? "left": false,
      width: '20px',
      render: (_, record) => {
        return (
          <Popconfirm
            title='¿Estas seguro de querer eliminar?'
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteOutlined />
          </Popconfirm>
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
    const dato = lista.findIndex((producto) => producto.codigo === item.codigo);
    console.log(lista);
    if (dato === -1)
      lista.push({
        key: lista.length.toString(),
        expand: true,
        titulo: item.titulo,
        codigo: item.codigo,
        clave: item.clave,
        clave_unidad: item.unidad_cfdi,
        series: [],
        max: item.inventario
          .map((inventario) => inventario.cantidad)
          .reduce((cantidad, sum) => cantidad + sum, 0),
        productimage:
          item.imagenes.length !== 0
            ? `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${item.imagenes[0].directus_files_id}`
            : '',
        cantidad: 1,
      });
    setListProducts(lista);
  };
  //#endregion

  const camposGenerales = (
    <>
      <Form.Item
        label='Concepto'
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
          style={{ width: '100%' }}
          placeholder='Concepto'
          optionFilterProp='children'
          onChange={(value) => {
            setTipo('sin_factura');
            setFactura('');
            setConcepto(value);
          }}
        >
          {Object.keys(conceptosMovimientos).map((concepto, indx) => (
            <Option key={indx} value={concepto}>
              {concepto}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {empleado.puesto === 'd5432f92-7a74-4372-907c-9868507e0fd5' ? (
        <Form.Item
          label='Almacén'
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
            placeholder='Almacén'
            onChange={(value) => {
              onSetAlmacen(value);
            }}
          >
            {almacenes.map((almacen) => (
              <Option
                value={almacen.clave}
                key={almacen.clave}
              >{`${almacen.clave} : ${almacen.clave_sucursal} `}</Option>
            ))}
          </Select>
        </Form.Item>
      ) : null}
      <Form.Item
        label='Comentario'
        name='comentario'
        rules={[
          {
            required: false,
          },
        ]}
      >
        <TextArea
          autoSize={{ minRows: 2, maxRows: 5 }}
          showCount
          maxLength={100}
          style={{ fontSize: '20' }}
        />
      </Form.Item>
    </>
  );

  const camposJustificacion = (
    <>
      {concepto === 'Compra' ? (
        <Form.Item
          label='Número de Compra'
          name='compras'
          rules={[
            {
              required: true,
              message: 'Asigna un número de compra',
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Justifica una entrada por compra a proveedor'
            initialvalues=''
            onChange={(value, all) => {
              onChangeCompra(all);
            }}
          >
            <Option key='' value=''>
              Ninguna
            </Option>
            {compras.map((compra, index) => {
              return (
                <Option
                  key={compra.no_compra}
                  value={compra.no_compra}
                  index={index}
                >
                  {`${compra.no_compra} : ${compra.fecha_compra}`}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      ) : null}
      {concepto === 'Venta' ? (
        <Form.Item
          label='Número de Venta'
          name='ventas'
          rules={[
            {
              required: true,
              message: 'Asigna un número de venta',
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Justifica una salida por venta a cliente'
            initialvalues=''
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
      ) : null}
      {concepto === 'Devolución a cliente' ? (
        <Form.Item
          label='Número de Devolución'
          name='devolucion_clientes'
          rules={[
            {
              required: true,
              message: 'Asigna un número de devolución',
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Justifica una entrada por devolución del cliente'
            initialvalues=''
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
      ) : null}
      {concepto === 'Devolución a proveedor' ? (
        <Form.Item
          label='Folio de RMA'
          name='rma'
          rules={[
            {
              required: true,
              message: 'Asigna un RMA',
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Justifica una salida por devolución a proveedor'
            initialvalues=''
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
      ) : null}
      {concepto === 'Componente defectuoso' ||
      concepto === 'Componente para ensamble' ? (
        <Form.Item
          label='Folio de Ensamble'
          name='folio_ensamble'
          rules={[
            {
              required: true,
              message: 'Asigna un número de folio de ensamble',
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Justifica un movimiento por ensamble'
            initialvalues=''
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
      ) : null}
      {concepto === 'Entrada por transferencia' ||
      concepto === 'Salida por transferencia' ? (
        <Form.Item
          label='Solicitud de Transferencia'
          name='no_transferencia'
          rules={[
            {
              required: true,
              message: 'Asigna un número de transferencia',
            },
          ]}
        >
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Justifica un movimiento por transferencia'
            initialvalues=''
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
      ) : null}
      {concepto !== 'Compra' && concepto !== 'Venta' ? (
        <Row gutter={16} key='Facturas'>
          <Col xs={24} lg={12} key={1}>
            <Form.Item label='Tipo de Factura' name='tipo'>
              <Select
                style={{ width: '100%' }}
                onChange={handleChangeTipo}
                value='sin_factura'
              >
                <Option key='sin_factura' value='sin_factura'>
                  Sin Factura
                </Option>
                <Option key='facturas_internas' value='facturas_internas'>
                  Facturas Internas
                </Option>
                <Option key='facturas_externas' value='facturas_externas'>
                  Facturas Externas
                </Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} lg={12} key={2}>
            <Form.Item label='Folio de Factura' name='folio_factura'>
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder='Folio de la factura'
                disabled={enabled}
                initialvalues=''
                onChange={(value) => setFactura(value)}
              >
                <Option key='' value=''>
                  Ninguna
                </Option>
                {facturas.map((factura) => {
                  return (
                    <Option key={factura.id} value={factura.id}>
                      {factura.id}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      ) : factura !== '' ? (
        <TextLabel
          title={`${
            tipo === 'facturas_externas'
              ? 'Factura Externa ID : ' + factura
              : 'Factura Interna ID : ' + factura
          }`}
        />
      ) : null}
    </>
  );

  return (
    <div>
      <Form
        name='nuevo_movimiento'
        initialValues={{ remember: true, concepto: 'Compra' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <HeadingBack title='Movimiento de Almacén' />
        <TextLabel title='Datos generales' />
        {itemsToGrid(camposGenerales.props.children, 'auto', 2, 16)}
        <TextLabel title='Justificación' />
        <Text type='secondary' style={{ display: 'block', marginBottom: 10 }}>
          Debe llenar mínimo 1 de los campos a continuación.
        </Text>
        {camposJustificacion}
        <TextLabel title='Productos' />
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
            Añadir Movimiento
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
