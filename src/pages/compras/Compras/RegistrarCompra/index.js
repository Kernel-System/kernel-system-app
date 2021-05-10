import { PageHeader } from 'antd';
import React, { useState } from 'react';
import LectorFacturas from 'components/shared/facturas/LectorFacturas';
import { Typography, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import CompraForm from 'components/forms/CompraForm';
import { useHistory } from 'react-router';

const { Title } = Typography;

const Index = () => {
  const onFacturaLeida = (factura) => {
    const cfdi = factura['$'];
    console.log({ factura });
    const emisor = factura['cfdi:Emisor'][0].$;
    setCompra((prev) => ({
      ...prev,
      rfc_proveedor: emisor.Rfc,
      folio: cfdi.Folio,
      fecha_compra: cfdi.Fecha,
      moneda: cfdi.Moneda,
      tipo_cambio: cfdi.TipoCambio,
      subtotal: cfdi.SubTotal,
      total: cfdi.Total,
      forma_pago: cfdi.FormaPago,
      metodo_pago: cfdi.MetodoPago,
    }));
  };
  const compraInicial = {
    rfc_proveedor: '',
    folio: '',
    fecha_compra: '',
    moneda: '',
    tipo_cambio: '',
    subtotal: '',
    total: '',
    forma_pago: '',
    metodo_pago: '',
  };
  const [compra, setCompra] = useState(compraInicial);
  const history = useHistory();

  return (
    <>
      <PageHeader
        className='site-page-header'
        onBack={() => history.goBack()}
        title='Registrar compra'
        subTitle={null}
        style={{ padding: '0 0 12px 0' }}
      />
      {/* <Breadcrumb>
        <Link to='/compras'>
          <Breadcrumb.Item>Compras</Breadcrumb.Item>
        </Link>
        <Breadcrumb.Item>Registrar compra</Breadcrumb.Item>
      </Breadcrumb> */}
      {/* <Title>Registrar compra</Title> */}
      <LectorFacturas onSuccess={onFacturaLeida} />
      <br />
      <Title level={4}>Datos de compra</Title>
      <CompraForm
        datosCompra={compra}
        submitText='REGISTRAR COMPRA'
      ></CompraForm>
    </>
  );
};

export default Index;
