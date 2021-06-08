import SucursalesList from 'components/list/SucursalesList';
import { Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Modal from 'components/sucursal/ModalSucursal';
import { useState } from 'react';
import HeadingBack from 'components/UI/HeadingBack';

const { Title } = Typography;

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [sucursal, setSucursal] = useState({});

  const changeModal = () => {
    setVisible(!visible);
  };

  const changeSucursal = (value) => {
    setSucursal(value);
    changeModal();
  };

  return (
    <div>
      <HeadingBack
        title='Sucursales'
        actions={[
          <Link to='/admid' key='1'>
            <Button>Administrador</Button>
          </Link>,
          <Link to='/admid/empleado' key='2'>
            <Button>Empleados</Button>
          </Link>,
          <Link to='/admid/cliente' key='3'>
            <Button>Clientes</Button>
          </Link>,
          <Link to='/admid/sucursal' selected key='4'>
            <Button type='primary'>Sucursales</Button>
          </Link>,
          <Link to='/admid/almacen' key='5'>
            <Button>Almacenes</Button>
          </Link>,
        ]}
      />
      <SucursalesList
        onClickItem={changeSucursal}
        //editItem={showModal}
        //onConfirmDelete={onConfirmDelete}
      />
      <br />
      <Link to='/admid/sucursal/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nueva Sucursal
        </Button>
      </Link>
      <Modal visible={visible} sucursal={sucursal} setVis={changeModal} />
    </div>
  );
};

export default Index;
