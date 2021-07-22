import { Modal, Select, Col, Row, Button, Alert } from 'antd';
import TextLabel from 'components/UI/TextLabel';
import { useEffect, useState } from 'react';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { httpSAT } from 'api';

const { Option } = Select;

const Index = ({ visible, global, hideModal }) => {
  const [facturas, setFacturas] = useState([]);
  const breakpoint = useBreakpoint();

  const onSetDato = (dato, setDato) => {
    setDato(dato);
  };

  useEffect(() => {
    let facturasIngresar = [];
    facturasIngresar = {
      id: global?.factura?.id,
      serie: global?.factura?.serie,
      folio: global?.factura?.folio,
      fecha: global?.factura?.fecha,
      ventas: global?.factura?.ventas_globales,
      id_fac: global?.factura?.id_api,
    };
    onSetDato(facturasIngresar, setFacturas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [global]);

  const descargarFactura = () => {
    httpSAT.get(`/cfdi/pdf/issued/${facturas?.id_fac}`).then((result_pdf) => {
      const linkSource =
        'data:application/pdf;base64,' + result_pdf.data.Content;
      const downloadLink = document.createElement('a');
      const fileName = `${facturas?.id_fac}.pdf`;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    });
  };

  return (
    <>
      <Modal
        title={`global: ${global.id}`}
        centered
        visible={visible}
        onCancel={hideModal}
        width={'85%'}
        footer={null}
      >
        <Row gutter={[16, 16]}>
          <Col span={breakpoint.lg ? 6 : 24}>
            <TextLabel title='Subtotal' subtitle={`$ ${global.subtotal}`} />
            <TextLabel title='Sucursal' subtitle={`${global?.sucursal}`} />
          </Col>
          <Col span={breakpoint.lg ? 6 : 24}>
            <TextLabel title='Descuento' subtitle={`$ ${global.descuento}`} />
            <TextLabel title='Factura' subtitle={`${facturas?.id}`} />
          </Col>
          <Col span={breakpoint.lg ? 6 : 24}>
            <TextLabel title='IVA' subtitle={`$ ${global.iva}`} />
          </Col>
          <Col span={breakpoint.lg ? 6 : 24}>
            <TextLabel title='Total' subtitle={`$ ${global.total}`} />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={breakpoint.lg ? 8 : 24}>
            <TextLabel title='Serie' subtitle={`${facturas?.serie}`} />
          </Col>
          <Col span={breakpoint.lg ? 8 : 24}>
            <TextLabel title='Folio' subtitle={`${facturas?.folio}`} />
          </Col>
          <Col span={breakpoint.lg ? 8 : 24}>
            <TextLabel title='Fecha' subtitle={`${global?.fecha}`} />
          </Col>
        </Row>
        <TextLabel title='Ventas' />
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder='Concepto'
          optionFilterProp='children'
        >
          {facturas?.ventas?.map((venta, indx) => (
            <Option key={indx} value={venta.no_venta}>
              {venta.no_venta}
            </Option>
          ))}
        </Select>
        <Button
          type='link'
          onClick={() => {
            descargarFactura();
          }}
        >
          Descargar Factura
        </Button>
      </Modal>
    </>
  );
};

export default Index;
