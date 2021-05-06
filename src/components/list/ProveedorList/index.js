import './styles.css';
import { useState } from 'react';
import { List, Typography, Button, Modal, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ProveedorForm from 'components/forms/ProveedorForm';

const { Title } = Typography;

const Index = ({ list }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listElement, setListElement] = useState({});
  const [listToShow, setListToShow] = useState(list);

  const showModal = (listElement) => {
    setIsModalVisible(true);
    setListElement(listElement);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const proveedorActualizado = () => {};

  const buscarProveedor = (e) => {
    setListToShow(
      list.filter((item) => item.rfc.includes(e.target.value.toUpperCase()))
    );
  };

  return (
    <>
      <Title>Lista de Proveedores</Title>
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
          <List.Item key={item.rfc}>
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
      <Link to='/añadir-proveedor'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nuevo Proveedor
        </Button>
      </Link>
      <Modal
        title={listElement.rfc}
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <ProveedorForm
          onSubmit={proveedorActualizado}
          submitText='Guardar cambios'
          datosProveedor={listElement}
        />
      </Modal>
    </>
  );
};

export default Index;