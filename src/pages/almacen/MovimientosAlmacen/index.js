import MovimientosAlmacenList from 'components/list/MovimientosAlmacenList';
import ModalMovimiento from 'components/almacen/ModalMovimiento';
import HeadingBack from 'components/UI/HeadingBack';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useStoreState } from 'easy-peasy';
import { useQuery } from 'react-query';
import { getUserRole } from 'api/auth';

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
  const changeModal = () => {
    setVisible(!visible);
  };

  const changeMovimiento = (value) => {
    setMovimiento(value);
    changeModal();
  };

  return (
    <>
      <HeadingBack title={`Movimientos de almacén`} />
      <MovimientosAlmacenList onClickItem={changeMovimiento} />
      <br />
      <Link to='/movimiento_almacen/nuevo'>
        <Button
          type='primary'
          size='large'
          icon={<PlusOutlined />}
          disabled={!onAccess() ? true : false}
        >
          Añadir Nuevo Movimiento
        </Button>
      </Link>
      <ModalMovimiento
        visible={visible}
        movimiento={movimiento}
        setVis={() => {
          setVisible(false);
          setMovimiento('');
        }}
      />
    </>
  );
};

export default Index;
