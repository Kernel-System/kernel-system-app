import { useState } from 'react';
import { Button, Modal, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import ProveedorForm from 'components/forms/ProveedorForm';
import Header from 'components/UI/Heading';
import CsvReader from 'components/shared/CsvReader';
import ListaProveedores from 'components/list/ProveedoresList';
import { filtrarPorProveedor } from 'api/compras/facturas_externas';
import * as CRUD from 'api/compras/proveedores';
import { useStoreState } from 'easy-peasy';

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
  const token = useStoreState((state) => state.user.token.access_token);

  const updateMutation = useMutation(
    (values) => CRUD.updateItem(values, token),
    {
      onSuccess: () => {
        queryClient
          .invalidateQueries('proveedores')
          .then(message.success('Cambios guardados exitosamente'));
      },
    }
  );
  const deleteMutation = useMutation(
    (values) => CRUD.deleteItem(values, token),
    {
      onSuccess: () => {
        queryClient
          .invalidateQueries('proveedores')
          .then(message.success('Registro eliminado exitosamente'));
      },
    }
  );
  const insertMutation = useMutation(
    (values) => CRUD.insertItems(values, token),
    {
      onSuccess: () => {
        queryClient
          .invalidateQueries('proveedores')
          .then(message.success('Proveedores importados exitosamente'));
      },
    }
  );
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
      <Space>
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
      </Space>
      <Modal
        title={listElement.razon_social}
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width='70%'
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
