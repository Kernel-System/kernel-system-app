import { useEffect, useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { http, httpSAT } from 'api';
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Table,
  Typography,
} from 'antd';
import { toPercent } from 'utils/functions';
import logo from 'utils/Cotizacion.png';
import { DeleteOutlined } from '@ant-design/icons';
import ModalProducto from 'components/devolucion-cliente/ModalDevolucion';
import { useQuery } from 'react-query';
import { getUserRole, getEmployeeSucursal } from 'api/auth';
import { useHistory } from 'react-router';
import TextLabel from 'components/UI/TextLabel';
import HeadingBack from 'components/UI/HeadingBack';
import moment from 'moment';
import { formasDePago } from 'utils/facturas/catalogo';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const { Option } = Select;
const { Search, TextArea } = Input;
const { Title } = Typography;

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
  const history = useHistory();
  const [ventas, setVentas] = useState([]);
  const [venta, setVenta] = useState();
  const [almacenes, setAlmacenes] = useState([]);
  const [almacen, setAlmacen] = useState([]);
  const [listProducts, setListProducts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [productos, setProductos] = useState([]);
  const [listToShow, setListProductsToShow] = useState([]);
  const formatoFecha = 'DD MMMM YYYY, hh:mm:ss a';
  const [form] = Form.useForm();

  const token = useStoreState((state) => state.user.token.access_token);
  const rol = useQuery(['rol_empleado'], () => getUserRole(token))?.data?.data
    ?.data.role.name;
  const sucursal = useQuery(['sucursal_empleado'], () =>
    getEmployeeSucursal(token)
  )?.data?.data?.data?.empleado[0]?.sucursal;
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    http
      .get(
        `/items/ventas/?fields=*, id_cliente.rfc,productos_venta.*,factura.*`,
        putToken
      )
      .then((result) => {
        onSetArreglo(result.data.data, setVentas);
      });
    http
      .get(`/items/almacenes/?fields=*,clave_sucursal.*`, putToken)
      .then((result) => {
        onSetArreglo(result.data.data, setAlmacenes);
      });
  }, []);

  const onSetArreglo = (lista, asignar) => {
    asignar(lista && Array.isArray(lista) ? lista.slice() : []);
  };

  const onFinish = (datos) => {
    const hide = message.loading('Generando devolución...', 0);
    if (verificarSeriesProductos()) {
      console.log(datos);
      console.log(listProducts);
      console.log(venta);
      const productosCambiar = [];
      listProducts.forEach((producto) => {
        if (producto.cantidad !== producto.cantidad_regresar) {
          productosCambiar.push({
            id: producto.id,
            codigo: producto.codigo,
            cantidad: producto.cantidad - producto.cantidad_regresar,
            descuento:
              (producto.descuento * producto.cantidad_regresar) /
              producto.cantidad,
            importe:
              producto.precio_unitario *
              (producto.cantidad - producto.cantidad_regresar),
            iva:
              (producto.iva * producto.cantidad_regresar) / producto.cantidad,
            no_venta: producto.no_venta,
            precio_unitario: producto.precio_unitario,
            series: producto.series,
          });
        } else {
          productosCambiar.push({
            id: producto.id,
            cantidad: 0,
            descuento: 0,
            importe: 0,
            iva: 0,
            key: '0',
            no_venta: 28,
            precio_unitario: 10,
            series: [],
          });
        }
      });
      if (venta.factura.length === 0) {
        http
          .patch(
            `/items/ventas/${datos.venta}`,
            {
              estado: 'Devolución',
              subtotal:
                venta.subtotal -
                listProducts
                  .map(
                    (producto) =>
                      producto.precio_unitario * producto.cantidad_regresar
                  )
                  .map((a, b) => a + b, 0),
              total:
                venta.total -
                listProducts
                  .map(
                    (producto) =>
                      producto.precio_unitario * producto.cantidad_regresar -
                      (producto.descuento * producto.cantidad_regresar) /
                        producto.cantidad +
                      (producto.iva * producto.cantidad_regresar) /
                        producto.cantidad
                  )
                  .map((a, b) => a + b, 0),
              iva:
                venta.iva -
                listProducts
                  .map(
                    (producto) =>
                      (producto.iva * producto.cantidad_regresar) /
                      producto.cantidad
                  )
                  .map((a, b) => a + b, 0),
              descuento:
                venta.descuento -
                listProducts
                  .map(
                    (producto) =>
                      (producto.descuento * producto.cantidad_regresar) /
                      producto.cantidad
                  )
                  .map((a, b) => a + b, 0),
            },
            putToken
          )
          .then(() => {
            productosCambiar.forEach((producto) => {
              http
                .patch(
                  `/items/productos_venta/${producto.id}`,
                  producto,
                  putToken
                )
                .then(() => {
                  agregarInventarioDevolucion(datos, {}, hide);
                });
            });
          });
      } else {
        let items = [];
        let relaciones = {
          Relations: {
            Type: venta.factura[0].metodo_pago, //VERIFICAR ESTE CAMPO
            Cfdis: [],
          },
        };
        venta.factura.forEach((factura) => {
          relaciones.Relations.Cfdis.push({ Uuid: factura.uuid });
        });
        listProducts.forEach((producto) => {
          items.push({
            ProductCode: producto.clave,
            IdentificationNumber: producto.codigo,
            Description: producto.descripcion,
            Unit: producto.nombre_unidad_cfdi, //
            UnitCode: producto.clave_unidad, //
            UnitPrice: producto.precio_unitario,
            Quantity: producto.cantidad_regresar.toFixed(2),
            Subtotal: (
              producto.precio_unitario * producto.cantidad_regresar
            ).toFixed(2),
            Discount: (
              (producto.descuento * producto.cantidad_regresar) /
              producto.cantidad
            ).toFixed(2),
            Taxes: [
              {
                Total: (
                  (producto.iva * producto.cantidad_regresar) /
                  producto.cantidad
                ).toFixed(2),
                Name: 'IVA',
                Rate: 0.16,
                Base: (
                  producto.precio_unitario * producto.cantidad_regresar -
                  (producto.descuento * producto.cantidad_regresar) /
                    producto.cantidad
                ).toFixed(2),
                IsRetention: false,
              },
            ],
            Total: (
              producto.precio_unitario * producto.cantidad_regresar -
              (producto.descuento * producto.cantidad_regresar) /
                producto.cantidad +
              (producto.iva * producto.cantidad_regresar) / producto.cantidad
            ).toFixed(2),
          });
        });
        httpSAT
          .post('/2/cfdis', {
            Serie: almacen.clave_sucursal.clave,
            Currency: 'MXN',
            ExpeditionPlace: almacen.clave_sucursal.cp,
            CfdiType: 'E',
            PaymentForm: datos.formaPago,
            PaymentMethod: 'PUE',
            Receiver: {
              Rfc: 'XAXX010101000', //values.rfc,
              Name: venta.factura[0].nombre_receptor,
              CfdiUse: 'G02',
            },
            ...relaciones,
            Items: items,
          })
          .then((result) => {
            http
              .post(
                `/items/facturas_internas`,
                {
                  folio: result.data.Folio,
                  serie: result.data.Serie,
                  tipo_de_comprobante: result.data.CfdiType.toUpperCase(),
                  fecha: result.data.Date,
                  condiciones_de_pago: result.data.PaymentTerms,
                  lugar_expedicion: result.data.ExpeditionPlace,
                  rfc_emisor: result.data.Issuer.Rfc,
                  nombre_emisor: almacen.clave_sucursal.nombre,
                  no_certificado: result.data.CertNumber,
                  regimen_fiscal: result.data.Issuer.FiscalRegime,
                  rfc_receptor: result.data.Receiver.Rfc,
                  nombre_receptor: result.data.Receiver.Name,
                  uso_cfdi: 'G02',
                  ventas: venta.no_venta,
                  //total_inpuestos_translados:"",
                  //total_impuestos_retenidos:"",
                  tipo_relacion: '', //AQUI FALTA
                  uuid: result.data.Complement.TaxStamp.Uuid,
                  fecha_timbrado: result.data.Complement.TaxStamp.Date,
                  no_certificado_sat: result.data.Complement.TaxStamp.SatSign,
                  forma_pago: datos.formaPago,
                  metodo_pago: 'PUE',
                  moneda: result.data.Currency,
                  descuento: result.data.Discount,
                  subtotal: result.data.Total,
                  tipo_cambio: 'MXN',
                  total: result.data.Subtotal,
                  rfc_prov_cert: result.data.Complement.TaxStamp.RfcProvCertif,
                  id_api: result.data.Id,
                },
                putToken
              )
              .then((result2) => {
                let cfdis_relacionados = [];
                venta.factura.forEach((factura) => {
                  cfdis_relacionados.push({
                    uuid: factura.uuid,
                    factura: result2.data.data.id,
                  });
                });
                http
                  .post(
                    `/items/cfdis_relacionados`,
                    cfdis_relacionados,
                    putToken
                  )
                  .then(() => {
                    agregarInventarioDevolucion(
                      datos,
                      {
                        folio: result.data.Folio,
                        id_int: result2.data.data.id,
                        fecha: result.data.Date,
                        id: result.data.Id,
                      },
                      hide
                    );
                  });
              });
          })
          .catch((error) => console.log(error));
      }
    } else {
      hide();
      message.warning('Error en los productos cantidad o series erroneas.');
    }
  };

  const formatPrice = (price) => {
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return formatter.format(price);
  };

  const obtenerFechaActual = () => {
    const fechaActual = moment().format('YYYY-MM-DDTHH:mm:ss');
    return fechaActual;
  };

  const agregarInventarioDevolucion = (datos, factura, hide) => {
    http
      .post(
        `/items/info_devoluciones_clientes`,
        {
          diagnostico: datos.diagnostico,
          no_venta: venta.no_venta,
        },
        putToken
      )
      .then((result_info) => {
        listProducts.forEach((producto, index) => {
          http
            .get(
              `/items/devolucion_inventario?filter[codigo_producto][_in]=${producto.codigo}&filter[clave_almacen][_in]=${almacen.clave}`,
              putToken
            )
            .then((result_dev_int) => {
              if (result_dev_int.data.data.length === 0) {
                http
                  .post(
                    `/items/devolucion_inventario`,
                    {
                      cantidad: producto.cantidad_regresar,
                      clave_almacen: almacen.clave,
                      codigo_producto: producto.codigo,
                    },
                    putToken
                  )
                  .then((result_dev_int1) => {
                    if (producto.series !== undefined) {
                      let series = [];
                      producto.series.forEach((serie) => {
                        series.push({
                          serie: serie,
                          devolucion_inventario: result_dev_int1.data.data.id,
                          info_devolucion: result_info.data.data.id,
                        });
                      });
                      http
                        .post(
                          `/items/devolucion_inventario_series`,
                          series,
                          putToken
                        )
                        .then(() => {
                          if (listProducts.length - 1 === index) {
                            agregarMovimientoAlmacen(
                              datos,
                              factura,
                              result_info.data.data.id,
                              hide
                            );
                          }
                        });
                    } else if (listProducts.length - 1 === index) {
                      agregarMovimientoAlmacen(
                        datos,
                        factura,
                        result_info.data.data.id,
                        hide
                      );
                    }
                  });
              } else {
                http
                  .patch(
                    `/items/devolucion_inventario/${result_dev_int.data.data.id}`,
                    {
                      cantidad:
                        result_dev_int.data.data.cantidad +
                        producto.cantidad_regresar,
                    },
                    putToken
                  )
                  .then((result_dev_int2) => {
                    if (producto.series !== undefined) {
                      let series = [];
                      producto.series.forEach((serie) => {
                        series.push({
                          serie: serie,
                          devolucion_inventario: result_dev_int2.data.data.id,
                          info_devolucion: result_info.data.data.id,
                        });
                      });
                      http
                        .push(
                          `/items/devolucion_inventario_series`,
                          series,
                          putToken
                        )
                        .then(() => {
                          if (listProducts.length - 1 === index) {
                            agregarMovimientoAlmacen(
                              datos,
                              factura,
                              result_info.data.data.id,
                              hide
                            );
                          }
                        });
                    } else if (listProducts.length - 1 === index) {
                      agregarMovimientoAlmacen(
                        datos,
                        factura,
                        result_info.data.data.id,
                        hide
                      );
                    }
                  });
              }
            });
        });
      });
  };

  const agregarMovimientoAlmacen = (datos, factura, devolucion, hide) => {
    http
      .post(
        `/items/movimientos_almacen/`,
        {
          fecha: obtenerFechaActual(),
          concepto: 'Devolución a cliente',
          comentario: datos.diagnostico,
          devolucion_clientes: devolucion.id,
          clave_almacen: almacen.clave,
          mostrar: true,
        },
        putToken
      )
      .then((result) => {
        if (Object.keys(factura).length !== 0) {
          //movimientos_almacen_factura
          http.post(
            `/items/movimientos_almacen_factura/`,
            {
              movimientos_almacen_id: result.data.data.id,
              collection: 'facturas_internas',
              item: factura.id_int,
            },
            putToken
          );
        }
        let productos = [];
        listProducts.forEach((producto) => {
          if (producto.cantidad > 0) {
            productos.push({
              codigo: producto.codigo,
              clave: producto.clave,
              cantidad: producto.cantidad_regresar,
              titulo: producto.descripcion,
              clave_unidad: producto.clave_unidad,
              id_movimiento: result.data.data.id,
            });
          }
        });
        http
          .post(`/items/productos_movimiento/`, productos, putToken)
          .then((result_productos) => {
            let series = [];
            let num = 0;
            listProducts.forEach((producto) => {
              if (producto.cantidad_regresar > 0) {
                const idMov = result_productos.data.data[num].id;
                num = num + 1;
                if (producto.series !== undefined)
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
              .then(() => {
                GenerarTicket(datos, venta.no_venta, factura, hide);
              });
          });
      });
  };

  const GenerarTicket = async (datos, no_venta, factura, hide) => {
    if (Object.keys(factura).length === 'factura') {
      http
        .get(
          `/items/ventas/${no_venta}=?fields=*, id_cliente.rfc,productos_venta.*`,
          putToken
        )
        .then((result_venta) => {
          const newVenta = result_venta.data.data;
          const doc = new jsPDF('p', 'mm', [
            80,
            100 + listProducts.length * 12 + 62,
          ]);
          const address = almacen.clave_sucursal.clave;
          var currentdate = new Date();
          doc.autoTable({
            margin: { top: 5, left: 5, right: 5 },
            styles: { halign: 'center', fillColor: [255, 255, 255] },
            //columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } }, // Cells in first column centered and green
            bodyStyles: {
              fontSize: 7.5,
              margin: 0,
              fillColor: [255, 255, 255],
              //lineWidth: 0.1,
              lineColor: [0, 0, 0],
            },
            pageBreak: 'auto',
            tableWidth: 'auto',
            body: [
              [[]],
              [
                [
                  [
                    `${address.calle} No. ${address.no_ext}${
                      address.entre_calle_1 &&
                      `, entre ${address.entre_calle_1}`
                    }Col. ${address.colonia} ${address.cp} ${
                      address.localidad && `- ${address.localidad}`
                    }, ${address.municipio}, ${address.estado}`,
                  ],
                ],
              ],
              [
                [
                  `Fecha: ${
                    String(currentdate.getDate()).padStart(2, '0') +
                    '/' +
                    String(currentdate.getMonth() + 1).padStart(2, '0') +
                    '/' +
                    currentdate.getFullYear() +
                    ' ' +
                    String(currentdate.getHours()).padStart(2, '0') +
                    ':' +
                    String(currentdate.getMinutes()).padStart(2, '0') +
                    ':' +
                    String(currentdate.getSeconds()).padStart(2, '0')
                  }`,
                ],
              ],
              [[`Empleado: ${newVenta.rfc_vendedor}`]],
            ],
            didParseCell: (data) => {
              data.cell.styles.fillColor = [255, 255, 255];
            },
            didDrawCell: (data) => {
              if (
                data.column.index === 0 &&
                data.row.index === 0 &&
                data.cell.section === 'body'
              ) {
                data.row.height = 16;
                data.cell.height = 16;
                const niceimage = new Image();
                niceimage.src = logo;
                var dim = data.cell.height; //- data.cell.padding('vertical');
                doc.addImage(
                  niceimage,
                  'JPEG',
                  data.cell.x + (data.table.columns[0].width - dim) / 2,
                  data.cell.y,
                  dim,
                  dim
                );
              }
              if (data.row.index === 3 && data.cell.section === 'body') {
                //
                let borderLineOffset = 1;
                const columnWidth = data.table.columns[0].width;
                data.doc.line(
                  data.cursor.x + columnWidth,
                  data.cursor.y + data.row.height - borderLineOffset / 2,
                  data.cursor.x,
                  data.cursor.y + data.row.height - borderLineOffset / 2
                );
              }
            },
          });
          let productos = [];
          newVenta.productos_venta.forEach((producto) => {
            productos.push([
              producto.codigo,
              producto.cantidad,
              producto.descripcion,
              formatPrice(producto.descuento).toFixed(2),
              formatPrice(
                (
                  producto.precio_unitario * producto.cantidad +
                  producto.iva -
                  producto.descuento
                ).toFixed(2)
              ),
            ]);
          });
          var begin4 = doc.lastAutoTable.finalY + 2;
          doc.autoTable({
            margin: { top: 5, left: 5, right: 5 },
            startY: begin4,
            //styles: { fillColor: [255, 0, 0] },
            //columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } }, // Cells in first column centered and green
            headStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              fontSize: 5,
              lineColor: [0, 0, 0],
            },
            bodyStyles: {
              fillColor: [255, 255, 255],
              fontSize: 5,
              lineColor: [0, 0, 0],
              halign: 'right',
            },
            columnStyles: {
              2: { halign: 'left' },
            },
            pageBreak: 'auto',
            tableWidth: 'auto',
            head: [['Cód.', 'Cant.', 'Nombre', 'Dto.', 'Imp.']],
            body: [...productos],
            didParseCell: (data) => {
              data.cell.styles.fillColor = [255, 255, 255];
            },
          });
          var begin2 = doc.lastAutoTable.finalY + 1;
          doc.autoTable({
            margin: { top: 5, left: 5, right: 5 },
            startY: begin2,
            styles: { fillColor: [255, 255, 255] },
            bodyStyles: {
              fontSize: 9,
              fillColor: [255, 255, 255],
              //minCellHeight: 20,
            },
            columnStyles: {
              0: { cellWidth: 43, halign: 'center', valign: 'rigth' },
              2: { cellWidth: 21.77777777777777, fillColor: [0, 0, 0] },
              // etc
            },
            body: [[[], []]],
            didParseCell: (data) => {
              data.cell.styles.fillColor = [255, 255, 255];
            },
            didDrawCell: (data) => {
              data.cell.styles.fillColor = [255, 255, 255];
              if (data.column.dataKey === 1 && data.cell.section === 'body') {
                doc.autoTable({
                  columnStyles: {
                    0: { fillColor: [255, 255, 255] },
                    1: { fillColor: [255, 255, 255] },
                    // etc
                  },
                  headStyles: {
                    textColor: [0, 0, 0],
                    fontSize: 5,
                  },
                  bodyStyles: {
                    fontSize: 4,
                    textColor: [0, 0, 0],
                    halign: 'right',
                  },
                  body: [
                    [
                      'SUBTOTAL',
                      `${formatPrice(
                        newVenta.productos_venta
                          .reduce(
                            (total, product) =>
                              total +
                              product.precio_unitario *
                                toPercent(100 - product.descuento) *
                                product.cantidad,
                            0
                          )
                          .toFixed(2)
                      )}`,
                    ],
                    [
                      'DESCUENTO',
                      `${formatPrice(
                        newVenta.productos_venta
                          .reduce(
                            (total, product) =>
                              total +
                              product.precio_unitario *
                                toPercent(product.descuento) *
                                product.cantidad,
                            0
                          )
                          .toFixed(2)
                      )}`,
                    ],
                    [
                      'IVA',
                      `${formatPrice(
                        newVenta.productos_venta
                          .reduce(
                            (total, product) =>
                              total +
                              product.precio_unitario *
                                toPercent(100 - product.descuento) *
                                toPercent(product.iva) *
                                product.cantidad,
                            0
                          )
                          .toFixed(2)
                      )}`,
                    ],
                    [
                      'TOTAL',
                      `${formatPrice(
                        newVenta.productos_venta
                          .reduce(
                            (total, product) =>
                              total +
                              product.precio_unitario *
                                toPercent(100 - product.descuento) *
                                toPercent(100 + product.iva) *
                                product.cantidad,
                            0
                          )
                          .toFixed(2)
                      )}`,
                    ],
                  ],
                  startY: data.cell.y,
                  startX: data.cell.x,
                  margin: { left: data.cell.x + data.cell.padding('left') },
                  tableWidth: 'wrap',
                  styles: {
                    fontSize: 6,
                    cellPadding: 1,
                  },
                });
              }
            },
          });
          var begin3 = doc.lastAutoTable.finalY + 8;
          doc.autoTable({
            margin: { top: 5, left: 5, right: 5 },
            styles: { halign: 'center', fillColor: [255, 255, 255] },
            //columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } }, // Cells in first column centered and green
            startY: begin3,
            bodyStyles: {
              fontSize: 7.5,
              margin: 0,
              //lineWidth: 0.1,
              lineColor: [0, 0, 0],
            },
            pageBreak: 'auto',
            tableWidth: 'auto',
            body: [[[`Número de venta: ${no_venta}`]]],
            didParseCell: (data) => {
              data.cell.styles.fillColor = [255, 255, 255];
            },
          });
          //console.log(inputRef.src);
          doc.save(`Ticket_${venta}.pdf`);
          hide();
          Mensaje('Creación de Ticket exitosa');
        });
    } else {
      //generar factura
      httpSAT.get(`/cfdi/pdf/issued/${factura.id}`).then((result) => {
        const linkSource = 'data:application/pdf;base64,' + result.data.Content;
        const downloadLink = document.createElement('a');
        const fileName = `${factura.id}.pdf`;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        httpSAT
          .post(
            `/cfdi?cfdiType=${'issued'}&cfdiId=${factura.id}&email=${
              datos.correo
            }`
          )
          .then((result) => {
            hide();
            Mensaje('Creación de Factura exitosa');
          });
      });
    }
  };

  const verificarSeriesProductos = () => {
    if (!listProducts.length) return false;
    const cantidadTotal = listProducts.reduce(
      (total, actual) => total + parseInt(actual.cantidad_regresar),
      0
    );
    if (cantidadTotal <= 0) return false;
    for (let i = 0; i < listProducts.length; i++) {
      const producto = listProducts[i];
      if (producto.expand && producto.cantidad_regresar > 0) {
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

  const onSelectVenta = (index) => {
    setListProducts([]);
    let newShowProducts = [];
    setVenta(ventas[index]);
    ventas[index].productos_venta.forEach((producto) => {
      newShowProducts.push(producto);
    });
    console.log(newShowProducts);
    setProductos(newShowProducts);
    setListProductsToShow(newShowProducts);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('lel');
    console.log('Failed:', errorInfo);
  };

  const Mensaje = () => {
    message
      .success('La orden de compra ha sido creada exitosamente', 3)
      .then(() => history.goBack());
  };

  //#region busqueda de productos
  const onSearchChange = (value) => {
    filtrarProductosPorTitulo(productos, value);
  };

  const filtrarProductosPorTitulo = async (productos, value) => {
    if (productos) {
      setListProductsToShow(
        productos.filter((item) => item.descripcion.includes(value))
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
      const cantidad = producto.cantidad_regresar;
      if (value < cantidad) {
        producto.series.splice(cantidad - 2, value);
      }
      producto.cantidad_regresar = value;
      let newProduct = [];
      newData.forEach((producto2) => {
        producto2.key === key
          ? newProduct.push(producto)
          : newProduct.push(producto2);
      });
      setListProducts(newProduct);
      setListProducts(newProduct);
      setEditingKey('');
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'descripcion',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad_regresar',
      render: (_, record) => {
        return (
          <>
            <InputNumber
              max={record.cantidad}
              min={0}
              defaultValue={record.cantidad_regresar}
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
    //.slice(concepto === 'Compra' || concepto === 'Venta' ? 1 : 0)
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
    const dato = lista.findIndex(
      (producto) => producto.descripcion === item.descripcion
    );
    console.log(item);
    if (dato === -1)
      lista.push({
        key: lista.length.toString(),
        ...item,
        expand: true,
        cantidad_regresar: 0,
        series: [],
      });
    else lista[dato] = { ...lista[dato], cantidad: lista[dato].cantidad + 1 };
    setListProducts(lista);
  };
  //#endregion

  return (
    <>
      <Form
        name='basic'
        key='1'
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <HeadingBack title='Orden de Compra' />
        <TextLabel title='Almacenes' />
        {rol !== 'encargado de ventas' ? (
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
              placeholder='Almacen1'
              optionFilterProp='children'
              onChange={(value, all) => {
                setAlmacen(almacenes[all.index]);
                //onChangeProveedor(value, index);
              }}
            >
              {almacenes.map((almacen, index) => (
                <Option key={almacen.clave} value={almacen.clave} index={index}>
                  {`${almacen.clave} : ${almacen.clave_sucursal.clave}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
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
              placeholder='Almacen2'
              optionFilterProp='children'
              onChange={(value, all) => {
                setAlmacen(almacenes[all.index]);
              }}
            >
              {almacenes.map((almacen, index) =>
                almacen.clave_sucursal.clave === sucursal ? (
                  <Option
                    key={almacen.clave}
                    value={almacen.clave}
                    index={index}
                  >
                    {`${almacen.clave} : ${almacen.clave_sucursal.clave}`}
                  </Option>
                ) : null
              )}
            </Select>
          </Form.Item>
        )}
        <TextLabel title='Ventas' />
        <Form.Item
          name='venta'
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
            placeholder='Venta'
            initialvalues=''
            onChange={(value, all) => {
              const index = all.index;
              onSelectVenta(index);
              //setVentaIndex(index);
              //onChangeCompraVenta(index);
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
        <TextLabel title='Forma de Pago' />
        <Form.Item
          name='formaPago'
          rules={[
            {
              required: true,
              message: 'Llenar una categoría',
            },
          ]}
        >
          <Select
            placeholder='Agrega una forma de pago'
            //value={selectedItems}
            //onChange={handleChangeItems}
            style={{ width: '100%' }}
          >
            {Object.keys(formasDePago).map((item) => {
              return (
                <Option value={item} key={item}>
                  {`${item} : ${formasDePago[item]}`}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <TextLabel title='Diagnostico' />
        <Form.Item
          name='diagnostico'
          rules={[
            {
              required: true,
              message: 'Llenar un diagnostico',
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
        <TextLabel title='Productos' />
        <Search
          placeholder='Buscar por producto de la venta'
          allowClear
          enterButton='Buscar'
          onSearch={(value) => {
            onSearchChange(value);
            setVisible(!visible);
          }}
        />
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
              expandIconColumnIndex: 2,
              expandedRowRender: (record) => (
                <div style={{ margin: 0 }}>
                  <Title level={5}>Series</Title>
                  {record.cantidad_regresar > 0 ? (
                    inputs(record, record.cantidad_regresar, record.key)
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
          <br />
        </Form>
        <Form.Item>
          <Button
            style={{ margin: '0 auto', display: 'block' }}
            type='primary'
            htmlType='submit'
          >
            Proceder la devolución
          </Button>
        </Form.Item>
      </Form>

      <br />
      <ModalProducto
        lista={listToShow}
        visible={visible}
        setVis={changeVisible}
        onSelection={addListItem}
      />
    </>
  );
};

//numero de venta
//diagnostico
//Nota
//Productos

export default Index;
