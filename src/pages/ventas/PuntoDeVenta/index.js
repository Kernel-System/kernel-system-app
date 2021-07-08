import {
  AutoComplete,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Popconfirm,
  Radio,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { http, httpSAT } from 'api';
import {
  getClienteNivel,
  getPuntoDeVentaProducts,
  getPuntoDeVentaServices,
} from 'api/ventas/punto_de_venta';
import {
  getClienteData,
  getSolicitudCompra,
} from 'api/ventas/solicitudes_compra';
import ProductsTable from 'components/shared/ProductsTable';
import Summary from 'components/table/Summary';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import Heading from 'components/UI/Heading';
import MetodoPagoModal from 'components/ventas/MetodoPagoModal';
import { useStoreState } from 'easy-peasy';
import { useQueryParams } from 'hooks/useQueryParams';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import logo from 'utils/Cotizacion.png';
import { toPercent } from 'utils/functions';
import { calcCantidad, calcPrecioVariable } from 'utils/productos';
const { Paragraph } = Typography;

const PuntoDeVenta = () => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const breakpoint = useBreakpoint();
  const query = useQueryParams();
  const token = useStoreState((state) => state.user.token.access_token);
  const [puntoDeVentaProducts, setPuntoDeVentaProducts] = useState([]);
  const [nivel, setNivel] = useState(1);
  const [spin, setSpin] = useState(false);
  const [productQuery, setProductQuery] = useState(undefined);
  const [serviceQuery, setServiceQuery] = useState(undefined);
  const [tipoComprobante, setTipoComprobante] = useState('ticket');
  const [formaPago, setFormaPago] = useState('01');
  const [metodoPago, setMetodoPago] = useState('PUE');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [empleado, setEmpleado] = useState({});
  const [almacenes, setAlmacenes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [disableCliente, setDisableCliente] = useState(false);
  const [cliente, setCliente] = useState({});

  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const onSetDato = (lista, setDato) => {
    setDato(lista);
  };

  useEffect(() => {
    if (query.get('solicitud') !== null) {
      getSolicitudCompra(query.get('solicitud'), token).then(
        ({ data: { data } }) => {
          setCliente(data.id_cliente);
          handleGetClienteNivel(data.id_cliente.rfc);
          data.productos_solicitados.forEach((producto) => {
            const newProducto = {
              ...producto.codigo_producto,
              descuento: producto.descuento_ofrecido,
              iva: producto.iva,
              precio_fijo: producto.precio_ofrecido,
              cantidad: producto.cantidad,
            };
            setPuntoDeVentaProducts((prevPuntoDeVentaProducts) => [
              ...prevPuntoDeVentaProducts,
              newProducto,
            ]);
          });
        }
      );
    }

    http
      .get(`/users/me?fields=empleado.*,empleado.sucursal.*`, putToken)
      .then((result) => {
        onSetDato(result.data.data.empleado[0], setEmpleado);
        http
          .get(
            `/items/almacenes?fields=clave&filter[clave_sucursal][_in]=${result.data.data.empleado[0].sucursal.clave}`,
            putToken
          )
          .then((result) => {
            onSetDato(
              result.data.data.map((almacen) => almacen.clave),
              setAlmacenes
            );
          });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const products = useQuery(['punto-de-venta-products', productQuery], () =>
    getPuntoDeVentaProducts(productQuery, token, empleado.sucursal)
  );

  const setProductData = () => {
    let productos = [];
    products.data?.data?.data.forEach((producto) => {
      let inventario = producto.inventario
        .filter((inven) => almacenes.includes(inven.clave_almacen))
        .map((inven) => {
          return { cantidad: inven.cantidad };
        });
      if (inventario.length > 0) {
        productos.push({ ...producto, inventario: inventario });
      }
    });
    return productos;
  };

  const productsData = setProductData(products.data?.data?.data);

  const services = useQuery(['punto-de-venta-services', serviceQuery], () =>
    getPuntoDeVentaServices(serviceQuery, token, empleado.sucursal)
  );

  const servicesData = services.data?.data?.data;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (datos) => {
    setSpin(true);
    setIsModalVisible(false);
    if (tipoComprobante === 'factura') {
      let items = [];
      puntoDeVentaProducts.forEach((producto) => {
        items.push({
          ProductCode: producto.clave,
          IdentificationNumber: producto.codigo,
          Description: producto.titulo,
          Unit: producto.nombre_unidad_cfdi.substring(0, 20),
          UnitCode: producto.unidad_cfdi,
          UnitPrice: calcPrecioVariable(producto, nivel),
          Quantity: producto.cantidad,
          Subtotal: calcPrecioVariable(producto, nivel) * producto.cantidad,
          Discount:
            calcPrecioVariable(producto, nivel) *
            producto.cantidad *
            (producto.descuento / 100),
          Taxes: [
            {
              Total:
                calcPrecioVariable(producto, nivel) *
                producto.cantidad *
                (1 - producto.descuento / 100) *
                (producto.iva / 100),
              Name: 'IVA',
              Rate: producto.iva / 100,
              Base:
                calcPrecioVariable(producto, nivel) *
                producto.cantidad *
                (1 - producto.descuento / 100),
              IsRetention: false,
            },
          ],
          Total:
            calcPrecioVariable(producto, nivel) *
            producto.cantidad *
            (1 - producto.descuento / 100) *
            (1 + producto.iva / 100),
        });
      });
      httpSAT
        .post('/2/cfdis', {
          Serie: empleado.sucursal.clave,
          Currency: 'MXN',
          ExpeditionPlace: empleado.sucursal.cp,
          CfdiType: 'I',
          PaymentForm: metodoPago,
          PaymentMethod: formaPago,
          Receiver: {
            Rfc: datos.rfc,
            Name: datos.razon_social,
            CfdiUse: datos.cfdi,
          },
          Items: items,
        })
        .then((result) => {
          http
            .post(
              `/items/facturas_internas`,
              {
                folio: result.data.Folio,
                serie: result.data.Serie,
                tipo_de_comprobante: result.data.CfdiType,
                fecha: result.data.Date,
                condiciones_de_pago: result.data.PaymentTerms,
                lugar_expedicion: result.data.ExpeditionPlace,
                rfc_emisor: result.data.Issuer.Rfc,
                nombre_emisor: empleado.sucursal.nombre,
                no_certificado: result.data.CertNumber,
                regimen_fiscal: result.data.Issuer.FiscalRegime,
                rfc_receptor: result.data.Receiver.Rfc,
                nombre_receptor: result.data.Receiver.Name,
                uso_cfdi: datos.cfdi,
                //total_inpuestos_translados:"",
                //total_impuestos_retenidos:"",
                tipo_relacion: '',
                uuid: result.data.Complement.TaxStamp.Uuid,
                fecha_timbrado: result.data.Complement.TaxStamp.Date,
                no_certificado_sat: result.data.Complement.TaxStamp.SatSign,
                forma_pago: metodoPago,
                metodo_pago: formaPago,
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
              ingresarVenta(datos, {
                folio: result.data.Folio,
                id_int: result2.data.data.id,
                fecha: result.data.Date,
                id: result.data.Id,
              });
            });
        })
        .catch((error) => console.log(error));
    } else {
      ingresarVenta(datos);
    }
    //facturas_internas
  };

  const ingresarVenta = (datos, factura) => {
    //venta
    http
      .post(
        `/items/ventas`,
        {
          estado: '',
          subtotal: puntoDeVentaProducts.reduce(
            (total, product) =>
              total + calcPrecioVariable(product, nivel) * product.cantidad,
            0
          ),
          descuento: puntoDeVentaProducts.reduce(
            (total, product) =>
              total +
              calcPrecioVariable(product, nivel) *
                toPercent(product.descuento) *
                product.cantidad,
            0
          ),
          moneda: 'MXN',
          tipo_cambio: 'MXN',
          iva: puntoDeVentaProducts.reduce(
            (total, product) =>
              total +
              calcPrecioVariable(product, nivel) *
                toPercent(100 - product.descuento) *
                toPercent(product.iva) *
                product.cantidad,
            0
          ),
          total: puntoDeVentaProducts.reduce(
            (total, product) =>
              total +
              calcPrecioVariable(product, nivel) *
                toPercent(100 - product.descuento) *
                toPercent(100 + product.iva) *
                product.cantidad,
            0
          ),
          metodo_pago: metodoPago,
          forma_pago: formaPago,
          comentarios: 'Venta en Tienda',
          factura: factura?.id_int,
          rfc_vendedor: empleado.rfc,
          cantidad_recibida: datos.cantidad,
          ucantidad_salida: datos.cambio,
          solicitud_compra: query.get('solicitd') && query.get('solicitud'),
        },
        putToken
      )
      .then((result_venta) => {
        let productosVenta = [];
        puntoDeVentaProducts.forEach((producto) => {
          productosVenta.push({
            no_venta: result_venta.data.data.no_venta,
            clave: producto.clave,
            codigo: producto.codigo,
            descripcion: producto.titulo,
            unidad: 'NO APLICA',
            clave_unidad: producto.unidad_cfdi,
            precio_unitario: calcPrecioVariable(producto, nivel),
            cantidad: producto.cantidad,
            importe: calcPrecioVariable(producto, nivel) * producto.cantidad,
            descuento:
              calcPrecioVariable(producto, nivel) *
              producto.cantidad *
              (producto.descuento / 100),
            iva:
              calcPrecioVariable(producto, nivel) *
              producto.cantidad *
              (1 - producto.descuento / 100) *
              (producto.iva / 100),
            estado: '',
          });
        });
        http
          .post(`/items/productos_venta`, productosVenta, putToken)
          .then(() => {
            if (tipoComprobante === 'factura') {
              http
                .post(
                  `/items/domicilios_ventas`,
                  {
                    no_venta: result_venta.data.data.no_venta,
                    estado: datos.estado,
                    municipio: datos.municipio,
                    localidad: datos.localidad,
                    calle: datos.calle,
                    no_ext: datos.no_ext,
                    no_int: datos.no_int,
                    colonia: datos.colonia,
                    cp: datos.cp,
                    entre_calle_1: datos.entre_calle_1,
                    entre_calle_2: datos.entre_calle_2,
                    pais: datos.pais,
                  },
                  putToken
                )
                .then(() => {
                  GenerarTicket(
                    datos,
                    result_venta.data.data.no_venta,
                    factura
                  );
                });
            } else {
              GenerarTicket(datos, result_venta.data.data.no_venta);
            }
          });
      });
    //domicilios_ventas
  };

  const formatPrice = (price) => {
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return formatter.format(price);
  };

  const GenerarTicket = async (datos, venta, factura) => {
    let factAdd = 0;
    if (tipoComprobante === 'factura') {
      factAdd = 62;
    }
    const doc = new jsPDF('p', 'mm', [
      80,
      100 + puntoDeVentaProducts.length * 12 + factAdd,
    ]);
    //doc.margin =

    //Logo
    //Kernel SYSTEMS
    //direccion empresa
    const address = empleado.sucursal;
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
                address.entre_calle_1 && `, entre ${address.entre_calle_1}`
              }${address.entre_calle_2 && ` y ${address.entre_calle_2}`} Col. ${
                address.colonia
              } ${address.cp} ${
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
        [[`Empleado: ${empleado.nombre}`]],
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
    var begin1 = doc.lastAutoTable.finalY;
    if (tipoComprobante === 'factura') {
      doc.autoTable({
        margin: { top: 5, left: 5, right: 5 },
        styles: { halign: 'center', fillColor: [255, 255, 255] },
        //columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } }, // Cells in first column centered and green
        startY: begin1,
        bodyStyles: {
          fontSize: 7.5,
          margin: 0,
          //lineWidth: 0.1,
          lineColor: [0, 0, 0],
        },
        pageBreak: 'auto',
        tableWidth: 'auto',
        body: [
          [['DATOS DEL CLIENTE']],
          [[`Razón social: ${datos.razon_social}`]],
          [[`CFDI: ${datos.cfdi}`]],
          [
            [
              [
                `${datos.calle} No. ${datos.no_ext}${
                  datos.entre_calle_1 && `, entre ${datos.entre_calle_1}`
                } ${datos.entre_calle_2 && ` y ${datos.entre_calle_2}`} Col. ${
                  datos.colonia
                } ${datos.cp} ${datos.localidad && ` - ${datos.localidad}`}, ${
                  datos.municipio
                }, ${datos.estado}`,
              ],
            ],
          ],
          [[`RFC: ${datos.rfc}`]],
          [[`Folio: ${factura.folio}`]],
          [[`Fecha de facturación: ${factura.fecha}`]],
        ],
        didParseCell: (data) => {
          data.cell.styles.fillColor = [255, 255, 255];
        },
        didDrawCell: (data) => {
          data.cell.styles.fillColor = [255, 255, 255];
          if (data.row.index === 6 && data.cell.section === 'body') {
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
    }
    let productos = [];
    puntoDeVentaProducts.forEach((producto) => {
      productos.push([
        producto.codigo,
        producto.cantidad,
        producto.titulo,
        formatPrice(
          (
            calcPrecioVariable(producto, nivel) *
            producto.cantidad *
            (producto.descuento / 100)
          ).toFixed(2)
        ),
        formatPrice(
          (
            calcPrecioVariable(producto, nivel) *
            producto.cantidad *
            (1 - producto.descuento / 100) *
            (1 + producto.iva / 100)
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
                  puntoDeVentaProducts
                    .reduce(
                      (total, product) =>
                        total +
                        calcPrecioVariable(product, nivel) *
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
                  puntoDeVentaProducts
                    .reduce(
                      (total, product) =>
                        total +
                        calcPrecioVariable(product, nivel) *
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
                  puntoDeVentaProducts
                    .reduce(
                      (total, product) =>
                        total +
                        calcPrecioVariable(product, nivel) *
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
                  puntoDeVentaProducts
                    .reduce(
                      (total, product) =>
                        total +
                        calcPrecioVariable(product, nivel) *
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
      body: [[[`Número de venta: ${venta}`]]],
      didParseCell: (data) => {
        data.cell.styles.fillColor = [255, 255, 255];
      },
    });
    //console.log(inputRef.src);
    doc.save(`Ticket_${venta}.pdf`);
    setSpin(false);
    if (tipoComprobante === 'factura') {
      //generar factura
      httpSAT.get(`/cfdi/pdf/issued/${factura.id}`).then((result) => {
        const linkSource = 'data:application/pdf;base64,' + result.data.Content;
        const downloadLink = document.createElement('a');
        const fileName = 'Y-cBTZ-NI21-sO98EVHYQQ2.pdf';
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
            okMessage('Creación de Ticket y Factura exitosa');
          });
      });
    } else {
      okMessage('Creación de Ticket exitosa');
    }
  };

  const okMessage = (mensaje) => {
    message.success(mensaje, 3).then(() => {
      history.go(0);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddToOrder = (codigo) => {
    try {
      const existingProduct = puntoDeVentaProducts.find(
        (product) => product.codigo === codigo
      );

      const isProduct = productsData.find(
        (product) => product.codigo === codigo
      );
      let newProduct = isProduct
        ? productsData.find((product) => product.codigo === codigo)
        : servicesData.find((service) => service.codigo === codigo);

      if (existingProduct) {
        setPuntoDeVentaProducts((prevPuntoDeVentaProducts) =>
          prevPuntoDeVentaProducts.map((product) =>
            product.codigo === codigo
              ? {
                  ...product,
                  cantidad: product.cantidad + 1,
                }
              : product
          )
        );
      } else {
        setPuntoDeVentaProducts((prevPuntoDeVentaProducts) => [
          ...prevPuntoDeVentaProducts,
          {
            ...newProduct,
            cantidad: 1,
          },
        ]);
      }
      message.success('Producto añadido correctamente');
    } catch (error) {
      message.error('Lo sentimos, ha ocurrido un error');
    }
  };

  const handleRemoveItem = (codigo) => {
    setPuntoDeVentaProducts((prevPuntoDeVentaProducts) =>
      prevPuntoDeVentaProducts.filter((product) => product.codigo !== codigo)
    );
  };

  const addOneToItem = (campo, codigo) => {
    setPuntoDeVentaProducts(
      puntoDeVentaProducts.map((product) =>
        product.codigo === codigo
          ? { ...product, [campo]: (product[campo] += 1) }
          : product
      )
    );
  };

  const subOneToItem = (campo, codigo) => {
    setPuntoDeVentaProducts(
      puntoDeVentaProducts.map((product) =>
        product.codigo === codigo
          ? { ...product, [campo]: (product[campo] -= 1) }
          : product
      )
    );
  };

  const setValueToItem = ({ campo, codigo, valor }) => {
    setPuntoDeVentaProducts(
      puntoDeVentaProducts.map((product) =>
        product.codigo === codigo
          ? {
              ...product,
              [campo]:
                campo === 'precios_variables' || campo === 'precio_fijo'
                  ? parseFloat(valor.replace(/[$]|,*/g, ''))
                  : parseInt(valor),
            }
          : product
      )
    );
  };

  const handleGetClienteNivel = (rfc) => {
    if (rfc) {
      setIsLoading(true);
      getClienteNivel(rfc.toUpperCase(), token).then(({ data: { data } }) => {
        if (!data.length) {
          message.error('Cliente no encontrado en el sistema');
        } else {
          setDisableCliente(true);
          setNivel(data[0].nivel);
        }
        setIsLoading(false);
      });
    }
  };

  const handleSetProductQuery = (query) => {
    setProductQuery(query);
    queryClient.invalidateQueries('punto-de-venta-products');
  };

  const handleSetServiceQuery = (query) => {
    setServiceQuery(query);
    queryClient.invalidateQueries('punto-de-venta-services');
  };

  return (
    <Spin size='large' spinning={spin}>
      <Heading
        title='Punto de venta'
        subtitle={
          <Popconfirm
            title='¿Está seguro que quiere comenzar una nueva venta?'
            okText='Nueva venta'
            okType='danger'
            cancelText='Cancelar'
            onConfirm={() => (window.location = '/venta')}
          >
            <Button type='primary'>Nueva venta</Button>
          </Popconfirm>
        }
        extra={
          query.get('solicitud')
            ? `Solicitud: #${query.get('solicitud')}`
            : empleado.nombre && `Le atiende: ${empleado.nombre}`
        }
      />
      {!cliente && query.get('solicitud') ? (
        <CenteredSpinner />
      ) : (
        <>
          <Form layout='vertical'>
            <Form.Item
              label='Cliente'
              normalize={(value) => (value || '').toUpperCase()}
            >
              <Input.Search
                onSearch={(rfc) => {
                  handleGetClienteNivel(rfc);
                  getClienteData(rfc, token).then(({ data: { data } }) => {
                    if (data.length) {
                      setCliente(data[0]);
                    }
                  });
                }}
                placeholder='Buscar cliente por RFC'
                disabled={disableCliente}
                maxLength={13}
                loading={isLoading}
                value={cliente.rfc}
              />
            </Form.Item>
            {!breakpoint.sm && <Divider style={{ marginTop: 0 }} />}
            <Form.Item label='Buscar producto'>
              <AutoComplete
                style={{ width: '100%' }}
                placeholder='Buscar producto por nombre o código'
                onSelect={handleAddToOrder}
                onChange={handleSetProductQuery}
                allowClear
              >
                {productsData?.map((productData) => (
                  <AutoComplete.Option
                    key={productData.codigo}
                    disabled={calcCantidad(productData) === 0}
                  >
                    <strong>{productData.codigo}</strong> | {productData.titulo}
                  </AutoComplete.Option>
                ))}
              </AutoComplete>
            </Form.Item>
            <Form.Item label='Buscar servicio'>
              <AutoComplete
                style={{ width: '100%' }}
                placeholder='Buscar servicio por nombre'
                onSelect={handleAddToOrder}
                onChange={handleSetServiceQuery}
                allowClear
              >
                {servicesData?.map((serviceData) => (
                  <AutoComplete.Option key={serviceData.codigo}>
                    <strong>{serviceData.codigo}</strong> | {serviceData.titulo}
                  </AutoComplete.Option>
                ))}
              </AutoComplete>
            </Form.Item>
          </Form>
          <ProductsTable
            products={puntoDeVentaProducts}
            nivel={query.get('solicitud') === null && nivel}
            type='venta'
            removeItem={handleRemoveItem}
            addOneToItem={addOneToItem}
            subOneToItem={subOneToItem}
            setValueToItem={setValueToItem}
          />
          <Row gutter={[16, 16]}>
            <Col span={breakpoint.lg ? 6 : 24}>
              <Card size='small' title='Factura'>
                <Paragraph type='secondary'>Elija una opción</Paragraph>
                <Radio.Group
                  defaultValue={tipoComprobante}
                  onChange={(e) => setTipoComprobante(e.target.value)}
                >
                  <Space direction='vertical'>
                    <Radio value={'ticket'}>Ticket</Radio>
                    <Radio value={'factura'}>Factura </Radio>
                  </Space>
                </Radio.Group>
              </Card>
            </Col>
            <Col span={breakpoint.lg ? 6 : 24}>
              <Card size='small' title='Método de Pago'>
                <Paragraph type='secondary'>Elija una opción</Paragraph>
                <Radio.Group
                  defaultValue={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  <Space direction='vertical'>
                    <Radio value={'01'}>Pago en efectivo</Radio>
                    <Radio value={'04'}>
                      Pago con tarjeta de débito o crédito
                    </Radio>
                  </Space>
                </Radio.Group>
              </Card>
            </Col>
            <Col span={breakpoint.lg ? 6 : 24}>
              <Card size='small' title='Forma de pago'>
                <Paragraph type='secondary'>Elija una opción</Paragraph>
                <Radio.Group
                  defaultValue={metodoPago}
                  onChange={(e) => setFormaPago(e.target.value)}
                >
                  <Space direction='vertical'>
                    <Radio value={'01'}>Pago en efectivo</Radio>
                    <Radio value={'04'}>
                      Pago con tarjeta de débito o crédito
                    </Radio>
                  </Space>
                </Radio.Group>
              </Card>
            </Col>
            <Col span={breakpoint.lg ? 6 : 24}>
              <Card size='small' title='Método de Pago'>
                <Paragraph type='secondary'>Elija una opción</Paragraph>
                <Radio.Group
                  defaultValue={formaPago}
                  disabled={tipoComprobante !== 'factura'}
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  <Space direction='vertical'>
                    <Radio value={'PUE'}>Pago en una exhibición</Radio>
                    <Radio value={'PPD'}>Pago en parcialidades</Radio>
                  </Space>
                </Radio.Group>
              </Card>
            </Col>
            <Col span={breakpoint.lg ? 6 : 24}>
              <Summary
                nivel={query.get('solicitud') === null && nivel}
                buttonLabel='Proceder a pagar'
                buttonAction={showModal}
                products={puntoDeVentaProducts}
                type='pdv'
              />
              <Link to='/cotizacion-cliente/nuevo'>
                <Button type='link' block style={{ marginTop: '1rem' }}>
                  Generar cotización
                </Button>
              </Link>
            </Col>
          </Row>
          <MetodoPagoModal
            cliente={cliente}
            products={puntoDeVentaProducts}
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            tipoComprobante={tipoComprobante}
            metodoPago={metodoPago}
            nivel={query.get('solicitud') === null && nivel}
          />
        </>
      )}
    </Spin>
  );
};

export default PuntoDeVenta;
