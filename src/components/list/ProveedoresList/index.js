import './styles.css';
import axios from 'axios';
import { useState } from 'react';
import { Popconfirm, List, Button, Modal, Input, message } from 'antd';
import { PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, QueryClient } from 'react-query';
import ProveedorForm from 'components/forms/ProveedorForm';
import Header from 'components/UI/Heading';

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

  const deleteItem = (values, onDeleted) => {
    axios
      .delete(
        'https://kernel-system-api.herokuapp.com/items/proveedores/' +
          values.rfc
      )
      .then(() => {
        refetch();
        onDeleted();
      });
  };

  const fetchItems = async () => {
    const { data } = await axios.get(
      'https://kernel-system-api.herokuapp.com/items/proveedores'
    );
    return data.data;
  };

  const onConfirmDelete = (item) => {
    deleteItem(item, () => message.success('Registro eliminado exitosamente'));
  };

  const onSaveChanges = (values) => {
    mutation.mutate(values);
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

  const queryClient = new QueryClient();

  const [searchValue, setSearchValue] = useState('');
  const { status, data, refetch } = useQuery('proveedores', async () => {
    const result = await fetchItems();
    setListToShow(result);
    filtrarProveedoresPorRFC(result, searchValue);
    return result;
  });
  const mutation = useMutation((formData) => updateItem(formData), {
    onSuccess: () => {
      message.success('Cambios guardados exitosamente');
      queryClient.invalidateQueries('proveedores');
      refetch();
    },
  });
  const [listToShow, setListToShow] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
            description={item.nombre}
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
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nuevo Proveedor
        </Button>
      </Link>
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
