import { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { focusManager, useMutation, useQueryClient } from 'react-query';
import CompraForm from 'components/forms/CompraForm';
import ListaCompras from 'components/list/ComprasList';
import * as CRUD from 'api/compras';
import moment from 'moment';
import 'moment/locale/es-mx';

const Index = (props) => {
  const showModal = (element) => {
    setIsModalVisible(true);
    setListElement(element);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onConfirmDelete = async (item) => {
    deleteMutation.mutate(item);
  };

  const onSaveChanges = (values) => {
    const newValues = {
      ...values,
      no_compra: listElement.no_compra,
      fecha_compra: moment(values.fecha_compra).format('YYYY-MM-DDTHH:mm:ss'),
      fecha_entrega: moment(values.fecha_entrega).format('YYYY-MM-DD'),
    };
    updateMutation.mutate(newValues);
  };

  const queryClient = useQueryClient();

  const updateMutation = useMutation(CRUD.updateItem, {
    onSuccess: () => {
      queryClient
        .invalidateQueries('compras')
        .then(message.success('Cambios guardados exitosamente'));
      queryClient.invalidateQueries('productos_comprados');
    },
  });
  const deleteMutation = useMutation(CRUD.deleteItem, {
    onSuccess: () => {
      queryClient
        .invalidateQueries('compras')
        .then(message.success('Registro eliminado exitosamente'));
      queryClient.invalidateQueries('productos_comprados');
    },
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listElement, setListElement] = useState({});

  return (
    <>
      <ListaCompras
        onClickItem={showModal}
        editItem={showModal}
        onConfirmDelete={onConfirmDelete}
      ></ListaCompras>
      <br />

      <Link to='/compras/registrar'>
        <Button type='primary' icon={<PlusOutlined />}>
          Registrar Compra
        </Button>
      </Link>
      <Modal
        title={listElement.nombre_proveedor}
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width='70%'
      >
        <CompraForm
          datosCompra={listElement}
          onSubmit={onSaveChanges}
          submitText='Guardar cambios'
        />
      </Modal>
    </>
  );
};

export default Index;
