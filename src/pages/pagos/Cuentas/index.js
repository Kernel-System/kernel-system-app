import CuentasList from 'components/list/CuentasList';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Modal from 'components/empleados/ModalEmpleado';
import { useState } from 'react';
import HeadingBack from 'components/UI/HeadingBack';

const Index = () => {
  return (
    <div>
      <HeadingBack title='Cuentas' />
      <CuentasList
      //editItem={showModal}
      //onConfirmDelete={onConfirmDelete}
      />
      <br />
      <Link to='/cuentas/pagos/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nuevo Pago
        </Button>
      </Link>
    </div>
  );
};

export default Index;
