import AlmacenList from 'components/list/AlmacenList';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Modal from 'components/almacen/ModalAlmacen';
import { useState } from 'react';
import HeadingBack from 'components/UI/HeadingBack';

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [almacen, setAlmacen] = useState({});

  const changeModal = () => {
    setVisible(!visible);
  };

  const changeAlmacen = (value) => {
    setAlmacen(value);
    changeModal();
  };

  return (
    <div>
      <HeadingBack
        title='Almacenes'
        actions={[
          <Link to='/admin' key='1'>
            <Button>Administrador</Button>
          </Link>,
          <Link to='/admin/empleado' key='2'>
            <Button>Empleados</Button>
          </Link>,
          <Link to='/admin/cliente' key='3'>
            <Button>Clientes</Button>
          </Link>,
          <Link to='/admin/sucursal' selected key='4'>
            <Button>Sucursales</Button>
          </Link>,
          <Link to='/admin/almacen' key='5'>
            <Button type='primary'>Almacenes</Button>
          </Link>,
        ]}
      />
      <AlmacenList
        onClickItem={changeAlmacen}
        //editItem={showModal}
        //onConfirmDelete={onConfirmDelete}
      />
      <br />
      <Link to='/admin/almacen/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Almacen
        </Button>
      </Link>
      <Modal visible={visible} almacen={almacen} setVis={changeModal} />
    </div>
  );
};

export default Index;
