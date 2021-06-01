import { Modal, Button, Row, Col } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import TextLabel from '../../UI/TextLabel';

const Index = ({ visible, sucursal, setVis }) => {
  const breakpoint = useBreakpoint();
  console.log(sucursal);

  return (
    <>
      <Modal
        title={`Cliente. ${sucursal.rfc}`}
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
        <TextLabel title='RFC' subtitle={sucursal.rfc} />
        <TextLabel
          title='Nombre Comercial'
          subtitle={sucursal.nombre_comercial}
        />
        <TextLabel title='Razón Social' subtitle={sucursal.razon_social} />
        <TextLabel title='Nivel' subtitle={sucursal.nivel} />
        <TextLabel
          title='Correo Electrónico'
          subtitle={
            Object.keys(sucursal).length !== 0 ? sucursal.cuenta.email : null
          }
        />
        <Row key='Row1' gutter={[16, 24]} style={{ marginBottom: '10px' }}>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <Row key='Row2' gutter={[16, 24]}>
              <Col className='gutter-row' span={8}>
                <TextLabel title='Extensión' subtitle={sucursal.extension} />
              </Col>
              <Col className='gutter-row' span={16}>
                <TextLabel title='Teléfono' subtitle={sucursal.telefono} />
              </Col>
            </Row>
          </Col>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <TextLabel title='Whatsapp' subtitle={sucursal.telefono_2} />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default Index;
