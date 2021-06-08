import { Modal, Button, Row, Col } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import TextLabel from '../../UI/TextLabel';

const Index = ({ visible, almacen, setVis }) => {
  const breakpoint = useBreakpoint();

  return (
    <>
      <Modal
        title={`Sucursal. ${almacen.clave}`}
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
        <TextLabel title='Clave' subtitle={almacen.clave} />
        <TextLabel title='Dimensiones' subtitle={almacen.dimensiones} />
        <TextLabel title='Encargado' subtitle={almacen.rfc_encargado} />
        <TextLabel title='Sucursal' subtitle={almacen.clave_sucursal} />
      </Modal>
    </>
  );
};

export default Index;
