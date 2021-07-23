import {
  Input,
  Button,
  Typography,
  Row,
  Col,
  Form,
  Select,
  Alert,
  InputNumber,
  message,
} from 'antd';
import TextLabel from 'components/UI/TextLabel';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import InputForm from 'components/shared/InputForm';
import Heading from 'components/UI/Heading';

import { calleRules, cpRules } from 'utils/validations/address';
import ReCAPTCHA from 'react-google-recaptcha';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { http, httpSAT } from 'api';
import { usosCfdi } from 'utils/facturas/catalogo';
const { Option } = Select;
const { Title } = Typography;

const Index = () => {
  const breakpoint = useBreakpoint();
  const token = useStoreState((state) => state.user.token.access_token);
  const [entrar, setEntrar] = useState(false);
  const [usuario, setUsuario] = useState([]);
  const [bloquear, setBloquear] = useState(false);

  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    http
      .get(
        `/users/me?fields=cliente.*,cliente.domicilios_cliente.*,cuenta.email`,
        putToken
      )
      .then((result) => {
        if (result.data.data.cliente.length === 0) {
          onSetDatos([{ domicilios_cliente: [{}] }], setUsuario);
          onSetDatos(false, setBloquear);
        } else {
          onSetDatos(result.data.data.cliente, setUsuario);
          onSetDatos(true, setBloquear);
        }
      })
      .catch(() => {
        onSetDatos([{ domicilios_cliente: [{}] }], setUsuario);
        onSetDatos(false, setBloquear);
      });
  }, []);

  const onSetDatos = (lista, setDato) => {
    setDato(lista);
  };

  const onFinish = (values) => {
    if (entrar)
      http
        .get(
          `/items/ventas/${values.no_ticket}?fields=*,productos_venta.*,rfc_vendedor.*,rfc_vendedor.sucursal.*,factura.id_api`
        )
        .then((result_venta) => {
          if (
            result_venta.data.data.factura.length === 0 &&
            result_venta.data.data.facturas_globales === null
          ) {
            let items = [];
            result_venta.data.data.productos_venta.forEach((producto) => {
              items.push({
                ProductCode: producto.clave,
                IdentificationNumber: producto.codigo,
                Description: producto.descripcion,
                Unit: producto.nombre_unidad_cfdi, //
                UnitCode: producto.clave_unidad, //
                UnitPrice: producto.precio_unitario,
                Quantity: producto.cantidad,
                Subtotal: (
                  producto.precio_unitario * producto.cantidad
                ).toFixed(2),
                Discount: producto.descuento.toFixed(2),
                Taxes: [
                  {
                    Total: producto.iva.toFixed(2),
                    Name: 'IVA',
                    Rate: 0.16,
                    Base: (
                      producto.precio_unitario * producto.cantidad -
                      producto.descuento
                    ).toFixed(2),
                    IsRetention: false,
                  },
                ],
                Total: (
                  producto.precio_unitario * producto.cantidad -
                  producto.descuento +
                  producto.iva
                ).toFixed(2),
              });
            });
            httpSAT
              .post('/2/cfdis', {
                Serie: result_venta.data.data.rfc_vendedor.sucursal.clave,
                Currency: 'MXN',
                ExpeditionPlace:
                  result_venta.data.data.rfc_vendedor.sucursal.cp,
                CfdiType: 'I',
                PaymentForm: result_venta.data.data.forma_pago,
                PaymentMethod: result_venta.data.data.metodo_pago,
                Receiver: {
                  Rfc: 'XAXX010101000', //values.rfc,
                  Name: values.razon_social,
                  CfdiUse: values.cfdi,
                },
                Items: items,
              })
              .then((result_fac) => {
                http
                  .post(
                    `/items/facturas_internas`,
                    {
                      folio: result_fac.data.Folio,
                      serie: result_fac.data.Serie,
                      tipo_de_comprobante: result_fac.data.CfdiType.toUpperCase(),
                      fecha: result_fac.data.Date,
                      condiciones_de_pago: result_fac.data.PaymentTerms,
                      lugar_expedicion: result_fac.data.ExpeditionPlace,
                      rfc_emisor: result_fac.data.Issuer.Rfc,
                      nombre_emisor:
                        result_venta.data.data.rfc_vendedor.sucursal.nombre,
                      no_certificado: result_fac.data.CertNumber,
                      regimen_fiscal: result_fac.data.Issuer.FiscalRegime,
                      rfc_receptor: values.rfc,
                      nombre_receptor: result_fac.data.Receiver.Name,
                      uso_cfdi: values.cfdi,
                      //total_inpuestos_translados:"",
                      //total_impuestos_retenidos:"",
                      tipo_relacion: '03',
                      uuid: result_fac.data.Complement.TaxStamp.Uuid,
                      fecha_timbrado: result_fac.data.Complement.TaxStamp.Date,
                      no_certificado_sat:
                        result_fac.data.Complement.TaxStamp.SatSign,
                      forma_pago: result_venta.data.data.metodo_pago,
                      metodo_pago: result_venta.data.data.forma_pago,
                      moneda: result_fac.data.Currency,
                      descuento: result_fac.data.Discount,
                      subtotal: result_fac.data.Total,
                      tipo_cambio: 'MXN',
                      total: result_fac.data.Subtotal,
                      rfc_prov_cert:
                        result_fac.data.Complement.TaxStamp.RfcProvCertif,
                      id_api: result_fac.data.Id,
                      ventas: values.no_ticket,
                    },
                    putToken
                  )
                  .then((result_fac_int) => {
                    httpSAT
                      .get(`/cfdi/pdf/issued/${result_fac.data.Id}`)
                      .then((result) => {
                        const linkSource =
                          'data:application/pdf;base64,' + result.data.Content;
                        const downloadLink = document.createElement('a');
                        const fileName = `${result_fac.data.Id}.pdf`;
                        downloadLink.href = linkSource;
                        downloadLink.download = fileName;
                        downloadLink.click();
                        httpSAT
                          .post(
                            `/cfdi?cfdiType=${'issued'}&cfdiId=${
                              result_fac.data.Id
                            }&email=${values.correo}`
                          )
                          .then(() => {
                            message.success('Factura Registrada con éxito.');
                          });
                      });
                  });
              });
          } else if (result_venta.data.data.facturas_globales === null) {
            httpSAT
              .get(`/cfdi/pdf/issued/${result_venta.factura[0].id_api}`)
              .then((result) => {
                const linkSource =
                  'data:application/pdf;base64,' + result.data.Content;
                const downloadLink = document.createElement('a');
                const fileName = `${result_venta.factura[0].id_api}.pdf`;
                downloadLink.href = linkSource;
                downloadLink.download = fileName;
                downloadLink.click();
                message.info('Ticket ya registrado');
              });
          } else message.info('Tiempo de facturación del Ticket finalizado.');
        })
        .catch(() => {
          message.info('Venta no existente.');
        });
    else message.info('Ingresa el CAPTCHA', 3);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return usuario.map((dato) => (
    <Form
      name='facturar_ticket'
      key='facturar_ticket'
      initialValues={{
        remember: true,
        rfc: dato.rfc,
        nombres: dato.nombre_comercial,
        razon_social: dato.razon_social,
        cp:
          dato?.domicilios_cliente !== undefined
            ? dato?.domicilios_cliente[0]?.cp
            : '',
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Heading title='Facturar Ticket de Compra' />
      <Alert
        message='La Factura será timbrada 24hrs hábiles después de realizar el pedido.'
        type='info'
      />
      <br />
      <Alert
        message='La venta debe ser registrada antes de las 10 p.m. del fin de mes de la compra correspondiente.'
        type='info'
      />
      <br />
      <Title level={5}>Número de ticket</Title>
      <Form.Item
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
        ]}
        name='no_ticket'
      >
        <InputNumber min={1} max={9999999999} style={{ width: '100%' }} />
      </Form.Item>
      <Title level={5}>RFC</Title>
      <Form.Item
        name='rfc'
        rules={[
          {
            required: true,
            message: 'Requerido',
          },
          {
            pattern:
              '[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]',
            message: 'Ingrese un RFC válido.',
          },
        ]}
      >
        <Input disabled={bloquear} maxLength={13} />
      </Form.Item>
      <br />
      <Title level={5}>Agregar Dirección</Title>
      <Row key='columnas' gutter={[16, 8]} style={{ marginBottom: '10px' }}>
        <Col
          className='gutter-row'
          span={breakpoint.lg ? 12 : 24}
          style={{ marginBottom: '10px' }}
        >
          <Title level={5}>Datos Personales</Title>
          <Title level={5}>Nombre(s)</Title>
          <InputForm
            titulo='nombres'
            mensaje='Asignar Nombre(s).'
            placeholder='Nombre(s).'
          />
          <Title level={5}>Correo Electrónico</Title>
          <Form.Item
            name='correo'
            rules={[
              {
                type: 'email',
                required: true,
                message: 'El correo electrónico no tiene un formato válido',
              },
            ]}
            type='email'
          >
            <Input maxLength={100} />
          </Form.Item>
        </Col>
        <Col
          className='gutter-row'
          span={breakpoint.lg ? 12 : 24}
          style={{ marginBottom: '10px' }}
        >
          <Title level={5}>Datos de facturación</Title>
          <Title level={5}>CFDI</Title>
          <Form.Item
            name='cfdi'
            rules={[
              {
                required: true,
                message: 'Llenar una categoría',
              },
            ]}
          >
            <Select
              placeholder='Agrega CFDI'
              //value={selectedItems}
              //onChange={handleChangeItems}
              style={{ width: '100%' }}
            >
              {Object.keys(usosCfdi).map((item) => {
                return (
                  <Option value={item} key={item}>
                    {usosCfdi[item]}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Title level={5}>Razón Social</Title>
          <Form.Item name='razon_social' rules={calleRules}>
            <Input disabled={bloquear} maxLength={100} />
          </Form.Item>
          {dato?.domicilios_cliente[0]?.cp !== null &&
          dato?.domicilios_cliente[0]?.cp !== undefined ? (
            <div>
              <TextLabel
                title='C.P.'
                subtitle={`${dato.domicilios_cliente[0].cp}`}
              />
            </div>
          ) : (
            <div>
              <TextLabel title='C.P.' />
              <Form.Item name='cp' rules={cpRules}>
                <Input />
              </Form.Item>
            </div>
          )}
        </Col>
      </Row>
      <br />
      <ReCAPTCHA
        sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
        onChange={() => {
          setEntrar(true);
        }}
        badge='inline'
      />
      <br />
      <Form.Item name='boton'>
        <Button
          style={{ margin: '0 auto', display: 'block' }}
          type='primary'
          htmlType='submit'
        >
          Generar Ticket
        </Button>
      </Form.Item>
    </Form>
  ));
};

export default Index;
