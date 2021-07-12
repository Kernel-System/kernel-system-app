import './styles.css';
import {
  DeleteOutlined,
  CaretDownFilled,
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
import { Link } from 'react-router-dom';
import ModalProducto from 'components/transferencia/ModalTransferencia';
import HeadingBack from 'components/UI/HeadingBack';
import TextLabel from 'components/UI/TextLabel';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { conceptosMovimientos } from 'utils/almacen';
import { itemsToGrid } from 'utils/gridUtils';
import moment from 'moment';

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
      .get(
        `/items/compras/?fields=*,proveedor.rfc, productos_comprados.*, productos_comprados.producto_catalogo.*`,
        putToken
      )
      .then((result) => {
        onSetArreglo(result.data.data, setCompras);
      });
    http
      .get(`/items/ventas/?fields=*, id_cliente.rfc`, putToken)
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
  };

  useEffect(() => {
    setListProducts([]);
    if (concepto !== 'Compra') {
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

  const onSetProductos = (lista) => {
    const newProductos = [];
    lista.forEach((producto) => {
      const inventarios = [];
      producto.inventario.forEach((inventario) => {
        if (esSuma(concepto)) {
          inventarios.push(inventario);
        } else if (
          inventario.clave_almacen === almacen &&
          inventario.cantidad !== 0
        )
          inventarios.push(inventario);
      });
      if (inventarios.length !== 0 || esSuma(concepto)) {
        producto.inventario = inventarios;
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

  const onFinish = (values) => {
    if (switchVerificarConcepto(values.concepto, values)) {
      if (verificarSeriesProductos()) {
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
            // console.log({ listProducts });
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
                if (concepto === 'Compra')
                  productosCoV.push({
                    id: producto.id,
                    cantidad: producto.cantidad,
                  });
              }
            });
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
                listProducts.forEach((producto) => {
                  if (producto.cantidad > 0) {
                    const idMov = result_productos.data.data[num].id;
                    num = num + 1;
                    producto.series.forEach((serie) => {
                      series.push({
                        serie: serie,
                        producto_movimiento: idMov,
                      });
                    });
                  }
                });
                http
                  .post(`/items/series_producto_movimiento/`, series, putToken)
                  .then((result_series) => {
                    agregarInventarios(values, hide);
                  });
              });
          });
      } else {
        message.error('Falta llenar datos de productos');
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

  const verificarSeriesProductos = () => {
    if (!listProducts.length) return false;
    const cantidadTotal = listProducts.reduce(
      (total, actual) => total + parseInt(actual.cantidad),
      0
    );
    if (cantidadTotal <= 0) return false;
    for (let i = 0; i < listProducts.length; i++) {
      const producto = listProducts[i];
      if (producto.expand && producto.cantidad > 0) {
        if (producto.series.length > 0)
          for (let j = 0; j < producto.series.length; j++) {
            if (producto.series[j] === '') return false;
          }
        else return false;
      }
      if (listProducts.length - 1 === i) {
        return true;
      }
    }
  };

  const onChangeCompra = (index) => {
    setTipo('facturas_externas');
    if (compras[index]?.factura !== undefined) {
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
      setFactura(compras[index].factura);
    } else {
      setFactura('');
    }
  };

  //+ Compra, Entrada por transferencia, Componente defectuoso
  //- Venta, Devolución a cliente, Devolución a proveedor, Salida por transferencia, Componente para ensamble

  const esSuma = (concepto) => {
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
        console.log({ productosAgregados });
        let productosPorAgregar = listProducts.filter(
          (producto) =>
            producto.cantidad > 0 && porAgregar.includes(producto.codigo)
        );

        inventario.data.data.forEach((producto_inv, index) => {
          http
            .patch(
              `/items/inventario/${producto_inv.id}`,
              {
                cantidad: esSuma(values.concepto)
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
              if (esSuma(values.concepto)) {
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
        producto.series.splice(cantidad - 2, value);
      }
      producto.cantidad = value;
      setListProducts(newData);
      setListProducts(newData);
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
    .slice(concepto === 'Compra' ? 1 : 0)
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

  const textoProductosPendientes = (total) => {
    let color = 'inherit';
    let texto = 'compra completada';
    if (total) {
      color = 'red';
      const s = total > 1 ? 's' : '';
      texto = `${total} producto${s} pendiente${s}`;
    }
    return <span style={{ color: color }}>{texto}</span>;
  };

  const camposGenerales = (
    <>
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
                setCompraIndex(index);
                onChangeCompra(index);
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
                      {compra.proveedor.rfc}
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
          >
            {ventas.map((venta) => {
              return (
                <Option key={venta.no_venta} value={venta.no_venta}>
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
        {itemsToGrid(camposGenerales.props.children, 'auto', 2, 16)}

        <TextLabel title='Justificación' />
        <Text type='secondary' style={{ display: 'block', marginBottom: 10 }}>
          Debe llenar mínimo 1 de los campos a continuación.
        </Text>
        {camposJustificacion}

        <TextLabel title='Productos' />
        <Form.Item>
          {concepto === 'Compra' ? (
            <>
              <Button
                type='default'
                onClick={() => onChangeCompra(compraIndex)}
              >
                <CaretDownFilled />
                Agregar todos de la compra
              </Button>
              <Link to='/productos-comprados'>
                <Button
                  type='default'
                  icon={<ShoppingOutlined />}
                  style={{ marginLeft: 16 }}
                >
                  Ver productos comprados
                </Button>
              </Link>
            </>
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
              expandIconColumnIndex: concepto === 'Compra' ? 2 : 3,
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
