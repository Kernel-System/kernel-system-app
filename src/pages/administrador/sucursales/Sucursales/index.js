import SucursalesList from 'components/list/SucursalesList';
import { http } from 'api';
import { Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Modal from 'components/sucursal/ModalSucursal';
import { useState } from 'react';
import HeadingBack from 'components/UI/HeadingBack';
import { useMutation, useQueryClient } from 'react-query';
import { useStoreState } from 'easy-peasy';

const Index = () => {
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const [visible, setVisible] = useState(false);
  const [sucursal, setSucursal] = useState({});

  const changeModal = () => {
    setVisible(!visible);
  };

  const changeSucursal = (value) => {
    setSucursal(value);
    changeModal();
  };

  const queryClient = useQueryClient();

  const deleteItem = async (values) => {
    return http.delete('/items/sucursales/' + values.clave, putToken);
  };

  const onConfirmDelete = (item) => {
    deleteMutation.mutate(item);
  };

  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient
        .invalidateQueries('sucursales')
        .then(message.success('La sucurlas se ha eliminado exitosamente'));
    },
  });

  return (
    <div>
      <HeadingBack
        title='Sucursales'
        actions={[
          <Link to='/empleado/perfil' key='1'>
            <Button>Administrador</Button>
          </Link>,
          <Link to='/admin/empleado' key='2'>
            <Button>Empleados</Button>
          </Link>,
          <Link to='/admin/cliente' key='3'>
            <Button>Clientes</Button>
          </Link>,
          <Link to='/admin/sucursal' selected key='4'>
            <Button type='primary'>Sucursales</Button>
          </Link>,
          <Link to='/admin/almacen' key='5'>
            <Button>Almacenes</Button>
          </Link>,
        ]}
      />
      <SucursalesList
        onClickItem={changeSucursal}
        putToken={putToken}
        onConfirmDelete={onConfirmDelete}
      />
      <br />
      <Link to='/admin/sucursal/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nueva Sucursal
        </Button>
      </Link>
      <Modal visible={visible} sucursal={sucursal} setVis={changeModal} />
    </div>
  );
};

export default Index;
