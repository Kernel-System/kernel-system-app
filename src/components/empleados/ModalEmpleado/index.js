import { Modal, Button, Row, Col } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import TextLabel from '../../UI/TextLabel';

const Index = ({ visible, sucursal, setVis }) => {
  const breakpoint = useBreakpoint();
  console.log(sucursal);
  const switchPuesto = (id) => {
    switch (id) {
      case '002b6741-eff7-4834-8a79-4f80034f6b40':
        return 'Encargado de almacen';
      case '319af35a-79ae-45b3-99f5-0ee2af47973d':
        return 'Encargado de ventas';
      case '39234854-dd25-430d-a6ce-0a6ba3532764':
        return 'Encargado de compras';
      case '39de2a37-7c23-4ca1-9c83-ee7263a7adc7':
        return 'Cuentas por cobrar';
      case '3afe4f4d-7125-45d5-ba57-402221ef956d':
        return 'Encargado de ensamble';
      case 'd5432f92-7a74-4372-907c-9868507e0fd5':
        return 'Administrator';
      default:
        return 'error';
    }
  };

  return (
    <>
      <Modal
        title={`Empleado. ${sucursal.rfc}`}
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
        <TextLabel title='Nombre' subtitle={sucursal.nombre} />
        <TextLabel
          title='Correo Electrónico'
          subtitle={
            Object.keys(sucursal).length !== 0 ? sucursal.cuenta.email : null
          }
        />
        <TextLabel title='Puesto' subtitle={switchPuesto(sucursal.puesto)} />

        <Row key='Row1' gutter={[16, 24]} style={{ marginBottom: '10px' }}>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <TextLabel title='Teléfono' subtitle={sucursal.telefono} />
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
