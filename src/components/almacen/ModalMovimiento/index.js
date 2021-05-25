import { Modal, Button } from 'antd';
import TextLabel from 'components/UI/TextLabel';
import { useEffect } from 'react';

const Index = ({ visible, clave, setVis }) => {
  useEffect(() => {
    // Buscar con clave
  }, []);

  return (
    <>
      <Modal
        title={`Ensamble No. ${clave}`}
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
        <TextLabel title='Fecha' description='01/01/2021' />
        <TextLabel title='Concepto' description='Venta' />
        <TextLabel title='Comentario' description='Ya pagada' />
        <TextLabel title='Justificacion' description='simon' />
        <TextLabel title='Productos con series' />
      </Modal>
    </>
  );
};

export default Index;
