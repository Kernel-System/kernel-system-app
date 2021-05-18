import './styles.css';
import axios from 'axios';
import { useState } from 'react';
import { Popconfirm, List, Button, Modal, Input, message } from 'antd';
import { PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ProveedorForm from 'components/forms/ProveedorForm';
import Header from 'components/UI/Heading';
import CsvReader from 'components/shared/CsvReader';

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

  const list = (
    <List
      itemLayout='horizontal'
      size='default'
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 10,
      }}
      dataSource={listToShow}
      renderItem={(item) => (
        <List.Item
          key={item.rfc}
          actions={[
            <Button
              icon={<EditFilled />}
              onClick={() => showModal(item)}
            ></Button>,
            <Popconfirm
              placement='left'
              title='¿Está seguro de querer borrar este registro?'
              okText='Sí'
              cancelText='No'
              onConfirm={() => onConfirmDelete(item)}
            >
              <Button danger icon={<DeleteFilled />}></Button>
            </Popconfirm>,
          ]}
        >
          <List.Item.Meta
            title={
              <p
                onClick={() => {
                  showModal(item);
                }}
                style={{
                  cursor: 'pointer',
                  margin: 0,
                }}
              >
                {item.rfc}
              </p>
            }
            description={item.razon_social}
          />
        </List.Item>
      )}
    />
  );

  return (
    <>
      <Header title='Proveedores' />
      <Input.Search
        onChange={onSearchChange}
        placeholder='Buscar por RFC'
        value={searchValue}
      ></Input.Search>
      <br />
      {list}
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
