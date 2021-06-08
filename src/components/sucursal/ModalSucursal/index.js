import { Modal, Button, Row, Col } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import TextLabel from '../../UI/TextLabel';

const Index = ({ visible, sucursal, setVis }) => {
  const breakpoint = useBreakpoint();

  return (
    <>
      <Modal
        title={`Sucursal. ${sucursal.clave}`}
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
        <TextLabel title='Clave' subtitle={sucursal.clave} />
        <TextLabel title='Nombre' subtitle={sucursal.nombre} />
        <TextLabel title='RFC' subtitle={sucursal.rfc} />
        <Row key='Row1' gutter={[16, 24]} style={{ marginBottom: '10px' }}>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <Row key='Row2' gutter={[16, 24]}>
              <Col className='gutter-row' span={12}>
                <TextLabel title='Extension' subtitle={sucursal.extension} />
              </Col>
              <Col className='gutter-row' span={12}>
                <TextLabel title='Teléfono' subtitle={sucursal.telefono} />
              </Col>
            </Row>
            <TextLabel title='Municipio' subtitle={sucursal.municipio} />
            <TextLabel title='Calle' subtitle={sucursal.calle} />
            <TextLabel
              title='Entre Calle 1'
              subtitle={sucursal.entre_calle_1}
            />
            <Row key='Row3' gutter={[16, 24]} style={{ marginBottom: '10px' }}>
              <Col className='gutter-row' span={8}>
                <TextLabel title='No. Ext.' subtitle={sucursal.no_ext} />
              </Col>
              <Col className='gutter-row' span={8}>
                <TextLabel title='No. Int.' subtitle={sucursal.no_int} />
              </Col>
              <Col className='gutter-row' span={8}>
                <TextLabel title='C.P.' subtitle={sucursal.cp} />
              </Col>
            </Row>
          </Col>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <TextLabel title='Estado' subtitle={sucursal.estado} />
            <TextLabel title='Localidad' subtitle={sucursal.localidad} />
            <TextLabel title='Colonia' subtitle={sucursal.colonia} />
            <TextLabel
              title='Entre Calle 2'
              subtitle={sucursal.entre_calle_2}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default Index;
