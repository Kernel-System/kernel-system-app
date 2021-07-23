import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { getUserRole } from 'api/auth';
import ModalDevolucion from 'components/devolucionesClientes/ModalDevolucion';
import DevolucionesClientesList from 'components/list/DevolucionesClientesList';
import HeadingBack from 'components/UI/HeadingBack';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [movimiento, setMovimiento] = useState({});
  const showModal = (element) => {
    // console.log({ element });
    setMovimiento(element);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <>
      <HeadingBack title={`Devoluciones a Clientes`} />
      <DevolucionesClientesList onClickItem={showModal} seeItem={showModal} />
      <Link to='/devolucion-clientes/nuevo'>
        <Button type='primary' icon={<PlusOutlined />}>
          Añadir Nueva Devolución
        </Button>
      </Link>
      <br />
      <ModalDevolucion
        visible={visible}
        movimiento={movimiento}
        hideModal={hideModal}
      />
    </>
  );
};

export default Index;
