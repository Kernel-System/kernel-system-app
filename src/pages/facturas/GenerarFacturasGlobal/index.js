import FacturasGlobalesList from 'components/list/FacturasGlobalesList';
import ModalGlobal from 'components/ventas/ModalGlobal';
import HeadingBack from 'components/UI/HeadingBack';
import { Button, message, Popconfirm } from 'antd';
import { useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { isLastDayOfMonth } from 'date-fns';
import { http, httpSAT } from 'api';

const Index = () => {
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const [visible, setVisible] = useState(false);
  const [global, setGobal] = useState({});
  const [loading, setLoading] = useState(false);
  const date = Date.now();

  const showModal = (element) => {
    setGobal(element);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const generarFacturaGlobal = () => {
    const hide = message.loading('Generando cotización...', 0);
    http
      .get(
        `/items/ventas?fields=*,productos_venta.*,rfc_vendedor.*,rfc_vendedor.sucursal.*`,
        putToken
      )
      .then((OldVentas) => {
        console.log(OldVentas.data.data);
        let ventas = OldVentas.data.data.filter(
          (venta) =>
            venta.factura.length === 0 && venta.facturas_globales === null
        );
        let sucursales = {};
        let forma_01 = 0;
        let forma_02 = 0;

        if (ventas.length !== 0) {
          ventas.forEach((venta) => {
            if (venta.forma_pago === '01') {
              forma_01 = forma_01 + 1;
            } else {
              forma_02 = forma_02 + 1;
            }
            let sucursal = [];
            if (
              sucursales[`${venta?.rfc_vendedor.sucursal?.clave}`]?.ventas !==
              undefined
            )
              sucursal = [
                ...sucursales[`${venta.rfc_vendedor.sucursal.clave}`].ventas,
              ];
            sucursal.push(venta);
            sucursales[`${venta.rfc_vendedor.sucursal.clave}`] = {
              ventas: sucursal,
              cp: venta.rfc_vendedor.sucursal.cp,
            };
          });
          let facturas = [];
          let facturasGlobales = [];
          Object.keys(sucursales).forEach((sucursal) => {
            console.log(
              sucursales[sucursal].ventas
                .map((venta) => venta.total)
                .reduce((a, b) => a + b, 0)
            );
            facturas.push({
              Serie: sucursal,
              Currency: 'MXN',
              ExpeditionPlace: sucursales[sucursal].cp,
              CfdiType: 'I',
              PaymentForm: forma_01 >= forma_02 ? '01' : '02',
              PaymentMethod: 'PUE',
              Receiver: {
                Rfc: 'XAXX010101000',
                Name: 'PUBLICO EN GENERAL',
                CfdiUse: 'P01',
              },
              Items: [
                {
                  ProductCode: '01010101',
                  IdentificationNumber: '01',
                  Description: 'Venta global',
                  Unit: 'ACT',
                  UnitCode: 'ACT',
                  UnitPrice: sucursales[sucursal].ventas
                    .map((venta) => venta.subtotal)
                    .reduce((a, b) => a + b, 0)
                    .toFixed(2),
                  Quantity: '1',
                  Subtotal: sucursales[sucursal].ventas
                    .map((venta) => venta.subtotal)
                    .reduce((a, b) => a + b, 0)
                    .toFixed(2),
                  Discount: sucursales[sucursal].ventas
                    .map((venta) => venta.descuento)
                    .reduce((a, b) => a + b, 0)
                    .toFixed(2),
                  Taxes: [
                    {
                      Total: (
                        sucursales[sucursal].ventas
                          .map((venta) => venta.subtotal - venta.descuento)
                          .reduce((a, b) => a + b, 0) * 0.16
                      ).toFixed(2),
                      Name: 'IVA',
                      Rate: 0.16,
                      Base: sucursales[sucursal].ventas
                        .map((venta) => venta.subtotal - venta.descuento)
                        .reduce((a, b) => a + b, 0)
                        .toFixed(2), //AQUI FALTA VERIFICAR
                      IsRetention: false,
                    },
                  ],
                  Total: sucursales[sucursal].ventas
                    .map((venta) => venta.total)
                    .reduce((a, b) => a + b, 0)
                    .toFixed(2),
                },
              ],
            });
            console.log(facturas);
          });
          console.log(facturas);
          facturas.forEach((factura) => {
            facturasGlobales.push({
              total: factura.Items[0].Total,
              subtotal: factura.Items[0].Subtotal,
              iva: factura.Items[0].Taxes[0].Total,
              descuento: factura.Items[0].Discount,
              sucursal:
                sucursales[factura.Serie].ventas[0].rfc_vendedor.sucursal.clave,
            });
          });
          facturas.forEach((factura, index) => {
            ingresarFacturas(
              sucursales[factura.Serie].ventas.map((venta) => venta.no_venta),
              factura,
              sucursales[factura.Serie].ventas[0].rfc_vendedor.sucursal.nombre,
              facturas.length === index + 1,
              facturasGlobales[index],
              hide
            );
          });
        } else {
          hide();
          message.info('No existen ventas disponibles a facturar');
        }
      });
  };

  const ingresarFacturas = (
    ventas,
    factura,
    nombre,
    final,
    fac_global,
    hide
  ) => {
    httpSAT
      .post('/2/cfdis', factura)
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
              nombre_emisor: nombre,
              no_certificado: result.data.CertNumber,
              regimen_fiscal: result.data.Issuer.FiscalRegime,
              rfc_receptor: result.data.Receiver.Rfc,
              nombre_receptor: result.data.Receiver.Name,
              uso_cfdi: 'P01',
              //total_inpuestos_translados:"",
              //total_impuestos_retenidos:"",
              tipo_relacion: '',
              uuid: result.data.Complement.TaxStamp.Uuid,
              fecha_timbrado: result.data.Complement.TaxStamp.Date,
              no_certificado_sat: result.data.Complement.TaxStamp.SatSign,
              forma_pago: '01',
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
            http
              .patch(
                `/items/ventas`,
                {
                  keys: ventas,
                  data: {
                    facturas_globales: result2.data.data.id,
                  },
                },
                putToken
              )
              .then(() => {
                http
                  .post(
                    `/items/facturas_globales`,
                    { ...fac_global, factura: result2.data.data.id },
                    putToken
                  )
                  .then(() => {
                    httpSAT
                      .get(`/cfdi/pdf/issued/${result.data.Id}`)
                      .then((result_pdf) => {
                        const linkSource =
                          'data:application/pdf;base64,' +
                          result_pdf.data.Content;
                        const downloadLink = document.createElement('a');
                        const fileName = `${result.data.Id}.pdf`;
                        downloadLink.href = linkSource;
                        downloadLink.download = fileName;
                        downloadLink.click();
                        httpSAT
                          .post(
                            `/cfdi?cfdiType=${'issued'}&cfdiId=${
                              result.data.Id
                            }&email=${process.env.REACT_APP_CORREO}`
                          )
                          .then(() => {
                            if (final) {
                              setLoading(!loading);
                              hide();
                            }
                            //okMessage('Creación de Ticket y Factura exitosa');
                          });
                      });
                  });
              });
          });
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <HeadingBack title={`Facturas Globales`} />
      <FacturasGlobalesList onClickItem={showModal} seeItem={showModal} />
      <br />
      <ModalGlobal visible={visible} global={global} hideModal={hideModal} />
      {!isLastDayOfMonth(date) ? (
        <Popconfirm
          title='¿Estas seguro de generar la factura global fuera del fin de mes?'
          onConfirm={() => {
            generarFacturaGlobal();
            setLoading(!loading);
          }}
          okText='Si'
          cancelText='No'
        >
          <Button
            type='primary'
            //icon={<PoweroffOutlined />}
            loading={loading}
          >
            Generar Facturas Globales
          </Button>
        </Popconfirm>
      ) : (
        <Button
          type='primary'
          //icon={<PoweroffOutlined />}
          loading={loading}
          onClick={() => {
            generarFacturaGlobal();
            setLoading(!loading);
          }}
        >
          Generar Facturas Globales
        </Button>
      )}
    </>
  );
};

export default Index;
