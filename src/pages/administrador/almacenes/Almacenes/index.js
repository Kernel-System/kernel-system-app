import AlmacenList from 'components/list/AlmacenList';
import { Button, message } from 'antd';
import { http } from 'api';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Modal from 'components/almacen/ModalAlmacen';
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
  const [almacen, setAlmacen] = useState({});

  const changeModal = () => {
    setVisible(!visible);
  };

  const changeAlmacen = (value) => {
    setAlmacen(value);
    changeModal();
  };

  const queryClient = useQueryClient();

  const deleteItem = async (values) => {
    return http.delete('/items/almacenes/' + values.clave, putToken);
  };

  const onConfirmDelete = (item) => {
    deleteMutation.mutate(item);
  };

  const deleteMutation = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient
        .invalidateQueries('almacenes')
        .then(message.success('Almacen eliminado exitosamente'));
    },
  });

  return (
    <div>
      <HeadingBack
        title='Almacenes'
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
            <Button>Sucursales</Button>
          </Link>,
          <Link to='/admin/almacen' key='5'>
            <Button type='primary'>Almacenes</Button>
          </Link>,
        ]}
      />
      <AlmacenList
        onClickItem={changeAlmacen}
        putToken={putToken}
        onConfirmDelete={onConfirmDelete}
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
