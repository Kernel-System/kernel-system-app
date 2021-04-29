import './styles.css';
import { useState } from 'react';
import { List, Typography, Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Title } = Typography;

const Index = ({ list }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [elementList, setelementList] = useState({});

  const showModal = (elementList) => {
    setIsModalVisible(true);
    setelementList(elementList);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Title>Lista de Proveedores</Title>
      buscador por rfc
      <br />
      combobox
      <List
        itemLayout='vertical'
        size='default'
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            key={item.rfc}
            onClick={() => {
              showModal(item);
            }}
          >
            <List.Item.Meta
              //avatar={<Avatar src={item.avatar} />}
              title={item.rfc}
              description={item.nombre}
            />
          </List.Item>
        )}
      />
      <br />
      <Button type='primary' size='large' icon={<PlusOutlined />}>
        Añadir Nuevo Proveedor
      </Button>
      <Modal
        title={elementList.rfc}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>{elementList.nombre}</p>
        <p>{elementList.razon}</p>
        <p>Lo que falta...</p>
      </Modal>
    </>
  );
};

export default Index;
