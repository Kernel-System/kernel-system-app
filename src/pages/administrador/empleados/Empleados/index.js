import EmpleadosList from 'components/list/EmpleadosList';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Modal from 'components/empleados/ModalEmpleado';
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
        title='Empleados'
        actions={[
          <Link to='/admin' key='1'>
            <Button>Administrador</Button>
          </Link>,
          <Link to='/admin/empleado' key='2'>
            <Button type='primary'>Empleados</Button>
          </Link>,
          <Link to='/admin/cliente' key='3'>
            <Button>Clientes</Button>
          </Link>,
          <Link to='/admin/sucursal' selected key='4'>
            <Button>Sucursales</Button>
          </Link>,
          <Link to='/admin/almacen' key='5'>
            <Button>Almacenes</Button>
          </Link>,
        ]}
      />
      <EmpleadosList
        onClickItem={changeSucursal}
        //editItem={showModal}
        //onConfirmDelete={onConfirmDelete}
      />
      <br />
      <Link to='/admin/empleado/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nuevo Empleado
        </Button>
      </Link>
      <Modal visible={visible} sucursal={sucursal} setVis={changeModal} />
    </div>
  );
};

export default Index;
