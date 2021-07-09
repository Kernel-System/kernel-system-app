import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { getUserRole } from 'api/auth';
import ModalMovimiento from 'components/almacen/ModalMovimiento';
import MovimientosAlmacenList from 'components/list/MovimientosAlmacenList';
import HeadingBack from 'components/UI/HeadingBack';
import { useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [movimiento, setMovimiento] = useState({});
  const token = useStoreState((state) => state.user.token.access_token);
  const rol = useQuery(['rol_empleado'], () => getUserRole(token))?.data?.data
    ?.data.role.name;

  const onAccess = () => {
    //ChangeVisible
    if (rol === 'encargado de almacen' || rol === 'administrador') return true;
    else return false;
  };

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
      <HeadingBack title={`Movimientos de almacén`} />
      <MovimientosAlmacenList onClickItem={showModal} seeItem={showModal} />
      <Link to='/movimientos/nuevo'>
        <Button
          type='primary'
          icon={<PlusOutlined />}
          disabled={!onAccess() ? true : false}
        >
          Añadir Nuevo Movimiento
        </Button>
      </Link>
      <br />
      <ModalMovimiento
        visible={visible}
        movimiento={movimiento}
        hideModal={hideModal}
      />
    </>
  );
};

export default Index;
