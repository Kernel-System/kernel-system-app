import { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import ProveedorForm from 'components/forms/ProveedorForm';
import Header from 'components/UI/Heading';
import CsvReader from 'components/shared/CsvReader';
import ListaProveedores from 'components/list/ProveedoresList';
import { filtrarPorProveedor } from 'api/shared/facturas_externas';
import * as CRUD from 'api/shared/proveedores';

const Index = (props) => {
  const showModal = (listElemenToShow) => {
    setIsModalVisible(true);
    setListElement(listElemenToShow);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onConfirmDelete = async (item) => {
    const hayFacturas = await filtrarPorProveedor(item.rfc).then((response) => {
      const datos = response.data.data;
      return datos.length;
    });
    if (!hayFacturas) deleteMutation.mutate(item);
    else message.warn('Existen facturas ligadas a este proveedor');
  };

  const onSaveChanges = (values) => {
    updateMutation.mutate(values);
  };

  const importarProveedores = (datos) => {
    const hide = message.loading('Importando proveedores...', 0);
    insertMutation.mutate(datos, { onSuccess: hide, onError: hide });
  };

  const queryClient = useQueryClient();

  const updateMutation = useMutation(CRUD.updateItem, {
    onSuccess: () => {
      queryClient
        .invalidateQueries('proveedores')
        .then(message.success('Cambios guardados exitosamente'));
    },
  });
  const deleteMutation = useMutation(CRUD.deleteItem, {
    onSuccess: () => {
      queryClient
        .invalidateQueries('proveedores')
        .then(message.success('Registro eliminado exitosamente'));
    },
  });
  const insertMutation = useMutation(CRUD.insertItems, {
    onSuccess: () => {
      queryClient
        .invalidateQueries('proveedores')
        .then(message.success('Proveedores importados exitosamente'));
    },
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listElement, setListElement] = useState({});

  return (
    <>
      <Header title='Proveedores' />
      <ListaProveedores
        onClickItem={showModal}
        editItem={showModal}
        onConfirmDelete={onConfirmDelete}
      ></ListaProveedores>
      <br />
      <Link to='/proveedores/nuevo'>
        <Button type='primary' icon={<PlusOutlined />}>
          Añadir Nuevo Proveedor
        </Button>
      </Link>
      <CsvReader
        hideMessage
        onSuccess={importarProveedores}
        text='Importar desde archivo .csv'
      ></CsvReader>
      <Modal
        title={listElement.razon_social}
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width='50%'
      >
        <ProveedorForm
          onSubmit={onSaveChanges}
          submitText='Guardar cambios'
          itemData={listElement}
          disableRFC
        />
      </Modal>
    </>
  );
};

export default Index;
