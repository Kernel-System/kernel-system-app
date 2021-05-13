import './styles.css';
import axios from 'axios';
import { useState } from 'react';
import { Popconfirm, List, Button, Modal, Input, message } from 'antd';
import { PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
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

  const updateItem = (values, onUpdated) => {
    axios
      .patch(
        'https://kernel-system-api.herokuapp.com/items/proveedores/' +
          values.rfc,
        values
      )
      .then((result) => {
        refetch();
        onUpdated();
      });
  };

  const deleteItem = (values, onDeleted) => {
    axios
      .delete(
        'https://kernel-system-api.herokuapp.com/items/proveedores/' +
          values.rfc
      )
      .then(() => {
        onDeleted();
      });
  };

  const fetchItems = () => {
    axios
      .get('https://kernel-system-api.herokuapp.com/items/proveedores')
      .then((result) => {
        setListToShow(result.data.data);
      });
  };

  const onConfirmDelete = (item) => {
    deleteItem(item, () => message.success('Registro eliminado exitosamente'));
  };

  const onSaveChanges = (values) => {
    updateItem(values, () => message.success('Cambios guardados exitosamente'));
  };

  const buscarProveedor = (e) => {
    console.log(dataList);
    // setListToShow(
    //     dataList.filter((item) =>
    //         item.rfc.includes(e.target.value.toUpperCase())
    //     )
    // );
  };

  const { status, data: dataList, refetch } = useQuery('data', () =>
    fetchItems()
  );
  const [listToShow, setListToShow] = useState(dataList);
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
        onChange={buscarProveedor}
        placeholder='Buscar por RFC'
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
