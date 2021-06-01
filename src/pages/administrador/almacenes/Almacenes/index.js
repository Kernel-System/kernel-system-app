import AlmacenList from 'components/list/AlmacenList';
import { Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Modal from 'components/almacen/ModalAlmacen';
import { useState } from 'react';

const { Title, Text } = Typography;

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [almacen, setAlmacen] = useState({});

  const changeModal = () => {
    setVisible(!visible);
  };

  const changeAlmacen = (value) => {
    setAlmacen(value);
    changeModal();
  };

  return (
    <div>
      <Title level={3}>Almacenes</Title>
      <AlmacenList
        onClickItem={changeAlmacen}
        //editItem={showModal}
        //onConfirmDelete={onConfirmDelete}
      />
      <br />
      <Link to='/admid/almacen/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Almacen
        </Button>
      </Link>
      <Modal visible={visible} almacen={almacen} setVis={changeModal} />
    </div>
  );
};

export default Index;
