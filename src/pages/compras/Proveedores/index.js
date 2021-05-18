import axios from 'axios';
import { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ProveedorForm from 'components/forms/ProveedorForm';
import Header from 'components/UI/Heading';
import CsvReader from 'components/shared/CsvReader';
import ListaProveedores from 'components/list/ProveedoresList';

const Index = () => {
  const showModal = (listElemenToShow) => {
    setIsModalVisible(true);
    setListElement(listElemenToShow);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const updateItem = (values) => {
    return axios.patch(
      'https://kernel-system-api.herokuapp.com/items/proveedores/' + values.rfc,
      values
    );
  };

  const deleteItem = (values) => {
    return axios.delete(
      'https://kernel-system-api.herokuapp.com/items/proveedores/' + values.rfc
    );
  };

  const fetchItems = async () => {
    const { data } = await axios.get(
      'https://kernel-system-api.herokuapp.com/items/proveedores'
    );
    return data.data;
  };

  const insertItems = (items) => {
    return axios.post(
      'https://kernel-system-api.herokuapp.com/items/proveedores',
      items
    );
  };

  const onConfirmDelete = (item) => {
    deleteMutation.mutate(item);
  };

  const onSaveChanges = (values) => {
    updateMutation.mutate(values);
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filtrarProveedoresPorRFC(data, value);
  };

  const filtrarProveedoresPorRFC = async (proveedores, value) => {
    if (proveedores)
      setListToShow(
        proveedores.filter((item) => item.rfc.includes(value.toUpperCase()))
      );
  };

  const importarProveedores = (datos) => {
    const hide = message.loading('Importando proveedores..', 0);
    insertMutation.mutate(datos, { onSuccess: hide });
  };

  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState('');
  const { data } = useQuery('proveedores', async () => {
    const result = await fetchItems();
    setListToShow(result);
    filtrarProveedoresPorRFC(result, searchValue);
    return result;
  });
  const updateMutation = useMutation((formData) => updateItem(formData), {
    onSuccess: () => {
      message.success('Cambios guardados exitosamente');
      queryClient.invalidateQueries('proveedores');
    },
  });
  const deleteMutation = useMutation((formData) => deleteItem(formData), {
    onSuccess: () => {
      message.success('Registro eliminado exitosamente');
      queryClient.invalidateQueries('proveedores');
    },
  });
  const insertMutation = useMutation((formData) => insertItems(formData), {
    onSuccess: () => {
      message.success('Proveedores importados exitosamente');
      queryClient.invalidateQueries('proveedores');
    },
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listToShow, setListToShow] = useState([]);
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
        title={listElement.rfc}
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width='50%'
      >
        <ProveedorForm
          onSubmit={onSaveChanges}
          submitText='Guardar cambios'
          datosProveedor={listElement}
        />
      </Modal>
    </>
  );
};

export default Index;
