import './styles.css';
import { useState, useEffect } from 'react';
import { Popconfirm, message, List, Button, Modal, Input } from 'antd';
import { PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ProveedorForm from 'components/forms/ProveedorForm';
import Header from 'components/UI/Heading';
import axios from 'axios';

const Index = ({ list }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listElement, setListElement] = useState({});
  const [listToShow, setListToShow] = useState([]);

  const showModal = (listElemenToShow) => {
    setIsModalVisible(true);
    setListElement(listElemenToShow);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const actualizarProveedores = (values) => {
    axios
      .patch(
        'https://kernel-system-api.herokuapp.com/items/proveedores/' +
          values.rfc,
        values
      )
      .then((result) => {
        console.log(result.data.data);
      });
  };

  const buscarProveedor = (e) => {
    setListToShow(
      list.filter((item) => item.rfc.includes(e.target.value.toUpperCase()))
    );
  };

  const eliminarProveedor = (values) => {
    axios.delete(
      'https://kernel-system-api.herokuapp.com/items/proveedores/' + values.rfc
    );
  };

  useEffect(() => {
    axios
      .get('https://kernel-system-api.herokuapp.com/items/proveedores')
      .then((result) => {
        console.log(result.data.data);
        setListToShow(result.data.data);
      });
  }, []);

  return (
    <>
      <Header title='Proveedores' />
      <Input.Search
        onChange={buscarProveedor}
        placeholder='Buscar por RFC'
      ></Input.Search>
      <br />
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
              >
                <Button
                  danger
                  icon={<DeleteFilled />}
                  onClick={() => eliminarProveedor(item)}
                ></Button>
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
          onSubmit={actualizarProveedores}
          submitText='Guardar cambios'
          datosProveedor={listElement}
        />
      </Modal>
    </>
  );
};

export default Index;
