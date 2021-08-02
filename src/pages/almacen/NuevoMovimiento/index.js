import {
  CaretDownFilled,
  DeleteOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
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
import { getItemsMovimiento, updateProductosRMA } from 'api/compras/rmas';
import ModalProducto from 'components/transferencia/ModalTransferencia';
import HeadingBack from 'components/UI/HeadingBack';
import TextLabel from 'components/UI/TextLabel';
import { useStoreState } from 'easy-peasy';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { conceptosMovimientos } from 'utils/almacen';
import './styles.css';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const formatoFecha = 'DD MMMM YYYY, hh:mm:ss a';

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
  const [compraIndex, setCompraIndex] = useState();
  const [ventaIndex, setVentaIndex] = useState();
  const [transferenciaIndex, setTransferenciaIndex] = useState();

  const [ocultarAgregar1, setOcultarAgregar1] = useState(true);
  const [ocultarAgregar2, setOcultarAgregar2] = useState(true);

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
      setEmpleado(result.data.data.empleado[0]);
      if (
        result.data.data.empleado[0].puesto ===
        'd5432f92-7a74-4372-907c-9868507e0fd5'
      ) {
        onSetAlmacen(1);
      } else {
        onSetAlmacen(result.data.data.empleado[0].almacen);
      }
    });
    getItemsMovimiento(false, token).then((result) => {
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
        `/items/solicitudes_transferencia/?fields=id,almacen_origen,almacen_destino,estado,productos_transferencia.*`,
        putToken
      )
      .then((result) => {
        onSetArreglo(result.data.data, setTransferencias);
      });
    http
      .get(
        `/items/compras/?fields=*, productos_comprados.*, productos_comprados.producto_catalogo.*`,
        putToken
      )
      .then((result) => {
        onSetArreglo(result.data.data, setCompras);
      });
    http
      .get(
        `/items/ventas/?fields=*, id_cliente.rfc,productos_venta.*, productos_venta.codigo.*`,
        putToken
      )
      .then((result) => {
        onSetArreglo(result.data.data, setVentas);
      });
    http.get(`/items/almacenes/`, putToken).then((result) => {
      onSetArreglo(result.data.data, setAlmacenes);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetAlmacen = (value) => {
    setAlmacen(value);
    onSetProductos(productos, value);
  };

  useEffect(() => {
    setListProducts([]); //aqui
    if (
      concepto !== 'Compra' &&
      concepto !== 'Venta' &&
      concepto !== 'Devolución a proveedor'
    ) {
      http
        .get(
          `/items/productos?fields=*,imagenes.directus_files_id,inventario.*`,
          putToken
        )
        .then((result) => {
          onSetProductos(result.data.data);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [almacen, concepto]);

  const onSetProductos = (lista, almacenParam) => {
    const newProductos = [];
    const almacenComparar = almacenParam ?? almacen;
    lista.forEach((producto) => {
      const inventarios = [];

      producto.inventario.forEach((inventario) => {
        if (
          esEntrada(concepto) ||
          (inventario.clave_almacen === almacenComparar &&
            inventario.cantidad !== 0)
        )
          inventarios.push(inventario);
      });

      if (inventarios.length || esEntrada(concepto)) {
        newProductos.push(producto);
      }
    });
    setProductos(newProductos);
    setListProductsToShow(newProductos);
  };

  const onSetArreglo = (lista, asignar) => {
    asignar(lista && Array.isArray(lista) ? lista.slice() : []);
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

  const obtenerFechaActual = () => {
    const fechaActual = moment().format('YYYY-MM-DDTHH:mm:ss');
    return fechaActual;
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

  const [productosActualizar, setProductosActualizar] = useState([]);

  const verificarSeries = (producto, rma) => {
    const series = producto.series.filter((serie) => !!serie);
    const cantidadSeries = series.length;
    if (cantidadSeries > 0 && cantidadSeries === producto.cantidad) {
      if (rma) {
        const newProductosActualizar = [];
        for (const serie of series) {
          const productosRMAConSeriePorEnviar = [];
          for (const productoRMA of rma.productos_rma) {
            if (
              productoRMA.producto_comprado.producto_catalogo.codigo ===
                producto.codigo &&
              productoRMA.serie === serie &&
              productoRMA.estado === 'pendiente_enviar'
            )
              productosRMAConSeriePorEnviar.push(productoRMA);
          }
          if (
            !productosRMAConSeriePorEnviar.length &&
            producto.cantidad > productosRMAConSeriePorEnviar.length
          )
            return false;
          else newProductosActualizar.push(...productosRMAConSeriePorEnviar);
        }
        // const copiaProductosActualizar = productosActualizar.slice()
        // console.log({copiaProductosActualizar})
        // console.log({newProductosActualizar})
        productosActualizar.push(...newProductosActualizar);
        setProductosActualizar(productosActualizar);
      }
    } else return false;
    return true;
  };

  const verificarProductos = (id_rma) => {
    if (!listProducts.length) return false;
    const cantidadTotal = listProducts.reduce(
      (total, actual) => total + parseInt(actual.cantidad),
      0
    );
    if (cantidadTotal <= 0) return false;
    const newProductosActualizar = [];
    for (const producto of listProducts) {
      if (producto.cantidad > 0) {
        const rma = devolucionesProv?.find((dev) => dev.id === id_rma);
        if (producto.expand) {
          if (!verificarSeries(producto, rma)) return false;
        } else if (rma) {
          const productosRMASinSeriePorEnviar = rma.productos_rma.filter(
            (productoRMA) =>
              productoRMA.serie === '' &&
              productoRMA.estado === 'pendiente_enviar'
          );
          if (producto.cantidad > productosRMASinSeriePorEnviar.length)
            return false;
          else newProductosActualizar.push(...productosRMASinSeriePorEnviar);
        }
      }
    }
    if (id_rma) {
      productosActualizar.push(...newProductosActualizar);
      setProductosActualizar(productosActualizar);
    }
    return true;
  };

  const onFinish = (values) => {
    if (switchVerificarConcepto(values.concepto, values)) {
      if (verificarProductos(values.rma)) {
        // console.log({ productosActualizar });
        const hide = message.loading('Agregando movimiento de almacén...', 0);
        http
          .post(
            `/items/movimientos_almacen/`,
            {
              fecha: obtenerFechaActual(),
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
              if (producto.cantidad > 0) {
                productos.push({
                  codigo: producto.codigo,
                  clave: producto.clave,
                  cantidad: producto.cantidad,
                  titulo: producto.titulo,
                  clave_unidad: producto.clave_unidad,
                  id_movimiento: result.data.data.id,
                });
                if (concepto === 'Compra' || concepto === 'Venta')
                  productosCoV.push({
                    id: producto.id,
                    cantidad: producto.cantidad,
                  });
              }
            });
            if (concepto === 'Compra') {
              http.post(
                '/custom/productos-compras/',
                { productos: productosCoV },
                putToken
              );
            } else if (concepto === 'Venta') {
              http.post(
                '/custom/productos-ventas/',
                { productos: productosCoV },
                putToken
              );
            } else if (concepto === 'Devolución a proveedor') {
              const idsProductosActualizar = productosActualizar.map(
                ({ id }) => id
              );
              const valoresProductos = {
                estado: 'pendiente_resolver',
              };
              console.log({ idsProductosActualizar });
              updateProductosRMA(
                idsProductosActualizar,
                valoresProductos,
                token
              );
            }
            http
              .post(`/items/productos_movimiento/`, productos, putToken)
              .then((result_productos) => {
                let series = [];
                let seriesVenta = [];
                let num = 0;
                listProducts.forEach((producto) => {
                  if (producto.cantidad > 0) {
                    const idMov = result_productos.data.data[num].id;
                    num = num + 1;
                    if (producto.series !== undefined)
                      producto.series.forEach((serie) => {
                        series.push({
                          serie: serie,
                          producto_movimiento: idMov,
                        });
                        if (concepto === 'Venta') {
                          seriesVenta.push({
                            serie: serie,
                            producto_venta: producto.id,
                          });
                        }
                      });
                  }
                });
                http
                  .post(`/items/series_producto_movimiento/`, series, putToken)
                  .then(() => {
                    if (concepto === 'Venta' && series.length !== 0) {
                      http
                        .post(
                          `/items/series_producto_venta/`,
                          seriesVenta,
                          putToken
                        )
                        .then(() => {
                          agregarInventarios(values, hide);
                        });
                    } else {
                      agregarInventarios(values, hide);
                    }
                  });
              });
          });
      } else {
        message.error(
          'LLene correctamente las cantidades o series de los productos'
        );
        setProductosActualizar([]);
      }
    } else {
      message.error('Falta especificar una justificación');
    }
  };

  const Mensaje = (hideLoading) => {
    hideLoading();
    message
      .success('El movimiento ha sido registrado exitosamente', 3)
      .then(() => history.goBack());
  };

  const onChangeCompraVenta = (index) => {
    if (concepto === 'Compra') {
      setTipo('facturas_externas');
      if (
        compras[index]?.factura !== undefined &&
        compras[index]?.factura !== null
      )
        setFactura(compras[index].factura);
      else setFactura('');

      const productos_comprados = [];
      compras[index].productos_comprados.forEach((producto) => {
        const producto_catalogo = producto.producto_catalogo;
        if (
          producto.cantidad_ingresada < producto.cantidad &&
          producto_catalogo &&
          producto_catalogo !== {} &&
          producto_catalogo.tipo_de_venta !== 'Servicio'
        ) {
          const productoEnTabla = listProducts.find(
            (prod) => prod.key === producto.id
          );
          const cantidad = productoEnTabla ? productoEnTabla.cantidad : 0;
          const expand = productoEnTabla ? productoEnTabla.expand : true;
          const series = productoEnTabla ? productoEnTabla.series : [];
          const nuevoProducto = {
            key: producto.id,
            expand: expand,
            titulo: producto.descripcion,
            id: producto.id,
            clave: producto.clave,
            clave_unidad: producto.clave_unidad,
            series: series,
            productimage: '',
            max: producto.cantidad - producto.cantidad_ingresada,
            cantidad: cantidad,
            codigo: producto_catalogo.codigo,
          };
          productos_comprados.push(nuevoProducto);
        }
      });
      setListProducts(productos_comprados);
    } else {
      setTipo('facturas_internas');
      if (
        ventas[index]?.factura !== undefined &&
        ventas[index]?.factura !== null
      )
        setFactura(ventas[index].factura);
      else setFactura('');
      const productos_comprados = [];
      ventas[index].productos_venta.forEach((producto) => {
        const producto_catalogo = producto.codigo;
        if (
          producto.cantidad_entregada < producto.cantidad &&
          producto_catalogo &&
          producto_catalogo !== {} &&
          producto_catalogo.tipo_de_venta !== 'Servicio'
        ) {
          const productoEnTabla = listProducts.find(
            (prod) => prod.key === producto.id
          );
          const cantidad = productoEnTabla ? productoEnTabla.cantidad : 0;
          const expand = productoEnTabla ? productoEnTabla.expand : true;
          const series = productoEnTabla
            ? productoEnTabla.series_producto_venta
            : [];
          const nuevoProducto = {
            key: producto.id,
            expand: expand,
            titulo: producto.descripcion,
            id: producto.id,
            clave: producto.clave,
            clave_unidad: producto.clave_unidad,
            series: series,
            productimage: '',
            max: producto.cantidad - producto.cantidad_entregada,
            cantidad: cantidad,
            codigo: producto_catalogo.codigo,
          };
          productos_comprados.push(nuevoProducto);
        }
      });
      setListProducts(productos_comprados);
    }
  };

  // ENTRADA: Compra, Entrada por transferencia, Componente defectuoso, Regreso de mercancía
  // SALIDA: Venta, Devolución a cliente, Devolución a proveedor, Salida por transferencia, Componente para ensamble
  const esEntrada = (concepto) => {
    if (conceptosMovimientos[concepto] === 'ENTRADA') return true;
    else return false;
  };

  const agregarInventarios = (values, hideLoading) => {
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
        let productosAgregados = listProducts.filter(
          (producto) =>
            producto.cantidad > 0 && yaAgregados.includes(producto.codigo)
        );
        let productosPorAgregar = listProducts.filter(
          (producto) =>
            producto.cantidad > 0 && porAgregar.includes(producto.codigo)
        );

        inventario.data.data.forEach((producto_inv, index) => {
          http
            .patch(
              `/items/inventario/${producto_inv.id}`,
              {
                cantidad: esEntrada(values.concepto)
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
              if (esEntrada(values.concepto)) {
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
                    Mensaje(hideLoading);
                  }
                });
            });
        });
        if (mostrarMensaje) {
          Mensaje(hideLoading);
        }
      });
  };

  const onFinishFailed = (errorInfo) => {
    message.warn('Falta llenar datos');
  };

  //#region busqueda de productos
  const onSearchChange = (value) => {
    // console.log({ value });
    filtrarProductosPorTitulo(productos, value);
  };

  const filtrarProductosPorTitulo = async (listaProductos, value) => {
    if (listaProductos) {
      if (value)
        setListProductsToShow(
          listaProductos.filter((item) => item.titulo?.includes(value))
        );
      else setListProductsToShow(listaProductos);
    }
  };

  const changeVisible = () => {
    setVisible(!visible);
  };
  //#endregion

  //#region Tabla informacion
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const changeSerie = (value, key, actual) => {
    const lista = listProducts.slice();
    const prod = lista.find((prod) => prod.key === key);
    prod.series[actual] = value;
    setListProducts(lista);
  };

  const inputs = (fila, numero, indice) => {
    const arreglo = Array.from(Array(numero).keys());
    const numeros = arreglo.map((actual) => {
      return (
        <Input
          key={`${fila.key}${actual}`}
          placeholder='Número de Serie'
          style={{ width: '100%', marginBottom: '10px' }}
          maxLength={100}
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

  const onChangeCantidad = (value, key) => {
    if (value >= 0) {
      const newData = listProducts.slice();
      const producto = newData.find((prod) => prod.key === key);
      const cantidad = producto.cantidad;
      if (value < cantidad) {
        producto.series = producto.series.splice(cantidad - 2, value);
      }
      producto.cantidad = value;
      let newProduct = [];
      newData.forEach((prod) => {
        prod.key === key ? newProduct.push(producto) : newProduct.push(prod);
      });
      setListProducts(newProduct);
      setListProducts(newProduct);
      setEditingKey('');
    }
  };

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'image',
      //fixed: "left",
      width: '100px',
      render: (_, record) => <Image width={50} src={record.productimage} />,
      editable: false,
    },
    {
      title: 'Nombre',
      dataIndex: 'titulo',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      render: (_, record) => {
        return (
          <>
            <InputNumber
              max={record.max}
              min={0}
              defaultValue={record.cantidad}
              onChange={(value) => {
                onChangeCantidad(value, record.key);
              }}
            />
            <Checkbox
              style={{ marginLeft: 16 }}
              onClick={() => {
                changeCheck(record.key);
              }}
              checked={record.expand}
            >
              ¿Son productos con serie?
            </Checkbox>
          </>
        );
      },
      editable: true,
    },
    {
      title: '',
      dataIndex: 'operation',
      //fixed: breakpoint.lg ? "left": false,
      width: '50px',
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

  const mergedColumns = columns
    .slice(concepto === 'Compra' || concepto === 'Venta' ? 1 : 0)
    .map((col) => {
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

  const addTransferenciaProducts = (index) => {
    const productos_comprados = [];
    if (index !== undefined && index !== '') {
      transferencias[index].productos_transferencia.forEach(
        (producto, index) => {
          const producto_catalogo = producto.codigo;
          const nuevoProducto = {
            key: index,
            expand: true,
            titulo: producto.titulo,
            id: producto.id,
            clave: producto.clave,
            clave_unidad: producto.clave_unidad,
            series: [],
            productimage: '',
            max: producto.cantidad,
            cantidad: 1,
            codigo: producto_catalogo.codigo,
          };
          productos_comprados.push(nuevoProducto);
        }
      );
      setListProducts(productos_comprados);
    }
  };
  //#endregion

  const totalProductosPendientes = (productos) => {
    const total = productos.reduce((total, current) => {
      const producto_catalogo = current.producto_catalogo;
      return (
        total +
        (producto_catalogo &&
          producto_catalogo !== {} &&
          producto_catalogo.tipo_de_venta !== 'Servicio' &&
          current.cantidad > current.cantidad_ingresada)
      );
    }, 0);
    return total;
  };

  const totalProductosRMAPendientes = (productos) => {
    const total = productos.reduce((total, current) => {
      return total + (current.estado === 'pendiente_enviar');
    }, 0);
    return total;
  };

  const textoProductosPendientes = (
    total,
    textoSuccess = 'compra completada'
  ) => {
    let color = 'inherit';
    let texto = '';
    if (total) {
      color = 'red';
      const s = total > 1 ? 's' : '';
      texto = `${total} producto${s} pendiente${s}`;
    } else texto = textoSuccess;
    return <span style={{ color: color }}>{texto}</span>;
  };

  const onChangeDevolucionProv = (rma) => {
    const productos_catalogo = [];
    devolucionesProv
      .find((dev) => dev.id === rma)
      ?.productos_rma.forEach((productoRMA) => {
        const producto_catalogo =
          productoRMA.producto_comprado.producto_catalogo;
        if (
          productoRMA.estado === 'pendiente_enviar' &&
          producto_catalogo &&
          producto_catalogo !== {} &&
          producto_catalogo.tipo_de_venta !== 'Servicio' &&
          !productos_catalogo.find(
            (prod) => prod.codigo === producto_catalogo.codigo
          )
        ) {
          productos_catalogo.push(producto_catalogo);
        }
      });
    setListProducts([]);
    onSetProductos(productos_catalogo);
  };

  const camposGenerales = (
    <>
      {concepto !== 'Entrada por transferencia' &&
      concepto !== 'Salida por transferencia' ? (
        <Form.Item
          label='Clave de Almacén'
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
      ) : null}
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
            setTransferenciaIndex('');
            setConcepto(value);
          }}
        >
          {Object.keys(conceptosMovimientos).map((concepto, indx) => {
            if (
              concepto === 'Devolución a cliente' ||
              concepto === 'Producto ensamblado'
            )
              return null;
            return (
              <Option key={indx} value={concepto}>
                {concepto}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
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
        <>
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
                const index = all.index;
                setOcultarAgregar1(false);
                setCompraIndex(index);
                onChangeCompraVenta(index);
              }}
            >
              {compras.map((compra, index) => {
                return (
                  <Option
                    key={compra.no_compra}
                    value={compra.no_compra}
                    index={index}
                  >
                    <b
                      style={{
                        opacity: 0.6,
                      }}
                    >
                      {compra.no_compra}
                    </b>
                    : comprado a{' '}
                    <b
                      style={{
                        opacity: 0.6,
                      }}
                    >
                      {compra.proveedor}
                    </b>{' '}
                    el{' '}
                    <b
                      style={{
                        opacity: 0.6,
                      }}
                    >
                      {moment(new Date(compra.fecha_compra)).format(
                        formatoFecha
                      )}
                    </b>{' '}
                    -{' '}
                    {textoProductosPendientes(
                      totalProductosPendientes(compra.productos_comprados)
                    )}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </>
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
            onChange={(value, all) => {
              const index = all.index;
              setOcultarAgregar2(false);
              setVentaIndex(index);
              onChangeCompraVenta(index);
            }}
          >
            {ventas.map((venta, index) => {
              return (
                <Option
                  key={venta.no_venta}
                  value={venta.no_venta}
                  index={index}
                >
                  <b
                    style={{
                      opacity: 0.6,
                    }}
                  >
                    {venta.no_venta}
                  </b>
                  : {venta.id_cliente ? 'vendido a ' : 'venta en tienda'}
                  <b
                    style={{
                      opacity: 0.6,
                    }}
                  >
                    {venta.id_cliente?.rfc}
                  </b>{' '}
                  el{' '}
                  <b
                    style={{
                      opacity: 0.6,
                    }}
                  >
                    {moment(new Date(venta.fecha_venta)).format(formatoFecha)}
                  </b>
                  {/* {`${venta.no_venta} : ${venta.fecha_venta}`} */}
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
            onChange={(value) => {
              onChangeDevolucionProv(value);
            }}
          >
            {devolucionesProv?.length ? (
              devolucionesProv.map((dev, index) => {
                return (
                  <Option key={index} value={dev.id}>
                    Folio{' '}
                    <b
                      style={{
                        opacity: 0.6,
                      }}
                    >
                      {dev.folio}
                    </b>
                    : del proveedor{' '}
                    <b
                      style={{
                        opacity: 0.6,
                      }}
                    >
                      {dev.compra.proveedor.rfc}
                    </b>{' '}
                    -{' '}
                    {textoProductosPendientes(
                      totalProductosRMAPendientes(dev.productos_rma),
                      'productos RMA enviados'
                    )}
                  </Option>
                );
              })
            ) : (
              <Option key='' value=''>
                Ninguna
              </Option>
            )}
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
            onChange={(value, all) => {
              const almacen = all.almacen;
              onSetAlmacen(almacen);
              setTransferenciaIndex(all.index);
              addTransferenciaProducts(all.index);
            }}
          >
            <Option key='' value=''>
              Ninguna
            </Option>
            {transferencias.map((transferencia, index) => {
              return transferencia.estado === 'Confirmado' ||
                transferencia.estado === 'Recibido' ||
                transferencia.estado === 'Recibido con Detalles' ? (
                empleado.puesto === 'd5432f92-7a74-4372-907c-9868507e0fd5' ? (
                  transferencia.estado === 'Confirmado' &&
                  concepto === 'Salida por transferencia' ? (
                    <Option
                      key={transferencia.id}
                      value={transferencia.id}
                      index={index}
                      almacen={transferencia.almacen_origen}
                    >
                      {`${transferencia.id} : Del almacén No. ${transferencia.almacen_origen} al almacén No. ${transferencia.almacen_destino}`}
                    </Option>
                  ) : (transferencia.estado === 'Recibido' ||
                      transferencia.estado === 'Recibido con Detalles') &&
                    concepto === 'Entrada por transferencia' ? (
                    <Option
                      key={transferencia.id}
                      value={transferencia.id}
                      index={index}
                      almacen={transferencia.almacen_destino}
                    >
                      {`${transferencia.id} : Del almacén No. ${transferencia.almacen_origen} al almacén No. ${transferencia.almacen_destino}`}
                    </Option>
                  ) : null
                ) : transferencia.almacen_origen === almacen &&
                  transferencia.estado === 'Confirmado' &&
                  concepto === 'Salida por transferencia' ? (
                  <Option
                    key={transferencia.id}
                    value={transferencia.id}
                    index={index}
                    almacen={transferencia.almacen_origen}
                  >
                    {`${transferencia.id} : Del almacén No. ${transferencia.almacen_origen} al almacén No. ${transferencia.almacen_destino}`}
                  </Option>
                ) : transferencia.almacen_destino === almacen &&
                  (transferencia.estado === 'Recibido' ||
                    transferencia.estado === 'Recibido con Detalles') &&
                  concepto === 'Entrada por transferencia' ? (
                  <Option
                    key={transferencia.id}
                    value={transferencia.id}
                    index={index}
                    almacen={transferencia.almacen_destino}
                  >
                    {`${transferencia.id} : Del almacén No. ${transferencia.almacen_origen} al almacén No. ${transferencia.almacen_destino}`}
                  </Option>
                ) : null
              ) : null;
            })}
          </Select>
        </Form.Item>
      ) : null}
      {false ? (
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
      ) : factura !== '' && tipo === 'facturas_internas' ? (
        <TextLabel title={`Factura Interna folio: ${factura}}`} />
      ) : null}
    </>
  );

  return (
    <div>
      <Form
        name='nuevo_movimiento'
        layout='vertical'
        initialValues={{ remember: true, concepto: 'Compra' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <HeadingBack title='Movimiento de Almacén' />
        <TextLabel title='Datos generales' />
        {camposGenerales}

        <TextLabel title='Justificación' />
        <Text type='secondary' style={{ display: 'block', marginBottom: 10 }}>
          Debe llenar mínimo 1 de los campos a continuación.
        </Text>
        {camposJustificacion}

        <TextLabel title='Productos' />
        <Form.Item>
          {concepto === 'Compra' || concepto === 'Venta' ? (
            <>
              <Button
                type='default'
                onClick={() =>
                  onChangeCompraVenta(
                    concepto === 'Compra' ? compraIndex : ventaIndex
                  )
                }
                disabled={
                  concepto === 'Compra' ? ocultarAgregar1 : ocultarAgregar2
                }
              >
                <CaretDownFilled />
                {concepto === 'Compra'
                  ? 'Agregar todos los productos de la compra'
                  : 'Agregar todos los productos de la venta'}
              </Button>
              {concepto === 'Compra' ? (
                <Link to='/productos-comprados'>
                  <Button
                    type='default'
                    icon={<ShoppingOutlined />}
                    style={{ marginLeft: 16 }}
                  >
                    Ver productos comprados
                  </Button>
                </Link>
              ) : null}
            </>
          ) : concepto === 'Entrada por transferencia' ||
            concepto === 'Salida por transferencia' ? (
            <Button
              type='default'
              onClick={() => addTransferenciaProducts(transferenciaIndex)}
              //disabled={ocultarAgregar3}
            >
              <CaretDownFilled />
              {'Agregar todos los productos de la transferencia'}
            </Button>
          ) : (
            <Search
              placeholder='Buscar por producto de catálogo'
              allowClear
              enterButton='Buscar'
              onSearch={(value) => {
                onSearchChange(value);
                setVisible(!visible);
              }}
            />
          )}
        </Form.Item>

        <Form form={form} component={false}>
          <Table
            defaultExpandAllRows={true}
            // columnWidth='10px'
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            expandable={{
              expandIconColumnIndex:
                concepto === 'Compra' || concepto === 'Venta' ? 2 : 3,
              expandedRowRender: (record) => (
                <div style={{ margin: 0 }}>
                  <Title level={5}>Series</Title>
                  {record.cantidad > 0 ? (
                    inputs(record, record.cantidad, record.key)
                  ) : (
                    <span>Incremente la cantidad para agregar series.</span>
                  )}
                </div>
              ),
              rowExpandable: (record) => record.expand,
            }}
            // scroll={{ x: 1000, y: 600 }}
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
