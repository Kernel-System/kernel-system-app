import ClientesList from 'components/list/ClientesList';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Modal from 'components/clientes/ModalCliente';
import { useState } from 'react';
import HeadingBack from 'components/UI/HeadingBack';

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
        title='Clientes'
        actions={[
          <Link to='/admid' key='1'>
            <Button>Administrador</Button>
          </Link>,
          <Link to='/admid/empleado' key='2'>
            <Button>Empleados</Button>
          </Link>,
          <Link to='/admid/cliente' key='3'>
            <Button type='primary'>Clientes</Button>
          </Link>,
          <Link to='/admid/sucursal' selected key='4'>
            <Button>Sucursales</Button>
          </Link>,
          <Link to='/admid/almacen' key='5'>
            <Button>Almacenes</Button>
          </Link>,
        ]}
      />
      <ClientesList
        onClickItem={changeSucursal}
        //editItem={showModal}
        //onConfirmDelete={onConfirmDelete}
      />
      <br />
      <Link to='/admid/cliente/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nuevo Cliente
        </Button>
      </Link>
      <Modal visible={visible} sucursal={sucursal} setVis={changeModal} />
    </div>
  );
};

export default Index;
