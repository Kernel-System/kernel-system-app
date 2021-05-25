import { Modal, Button, Row, Col } from 'antd';
import TextLabel from 'components/UI/TextLabel';
import { useEffect } from 'react';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const Index = ({ visible, clave, setVis }) => {
  const breakpoint = useBreakpoint();

  useEffect(() => {
    // Buscar con clave
  }, []);

  return (
    <>
      <Modal
        title={`Pago No. ${clave}`}
        centered
        visible={visible}
        onOk={() => {
          setVis();
        }}
        onCancel={() => {
          setVis();
        }}
        width={'85%'}
        footer={[
          <Button
            key='submit'
            type='primary'
            onClick={() => {
              setVis();
            }}
          >
            Confirmar
          </Button>,
        ]}
      >
        <Row key='columnas' gutter={[16, 8]} style={{ marginBottom: '10px' }}>
          <Col
            className='gutter-row'
            span={breakpoint.lg ? 12 : 24}
            style={{ marginBottom: '10px' }}
          >
            <TextLabel title='Folio de Factura' description='000000001' />
            <TextLabel title='Forma de Pago' description='Efectivo' />
            <TextLabel title='Tipo de Cambio' description='MXN' />
            <TextLabel title='Número de operación' description='000000001' />
            <TextLabel title='RFC Emisor Cuenta Ordenante' description='RFC1' />
            <TextLabel
              title='RFC Emisor Cuenta Beneficiario'
              description='RFC2'
            />
          </Col>
          <Col
            className='gutter-row'
            span={breakpoint.lg ? 12 : 24}
            style={{ marginBottom: '10px' }}
          >
            <TextLabel title='Fecha de Pago' description='01/01/2021' />
            <TextLabel title='Moneda' description='MXN' />
            <TextLabel title='Monto' description='1000.00' />
            <TextLabel title='Nombre del banco' description='BANORTE' />
            <TextLabel title='Cuenta Ordenante' description='CUENTA1' />
            <TextLabel title='Cuenta Beneficiario' description='CUENTA2' />
          </Col>
        </Row>
        <TextLabel title='Tabla 1' />
        <TextLabel title='Archivos' />
      </Modal>
    </>
  );
};

export default Index;
