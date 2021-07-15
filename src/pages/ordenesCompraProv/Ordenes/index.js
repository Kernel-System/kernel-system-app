import OrdenesCompraList from 'components/list/OrdenesCompraList';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import ModalOrdenesCompra from 'components/ordenCompra/ModalOrdenesCompra';
import { useState } from 'react';
import HeadingBack from 'components/UI/HeadingBack';

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [orden, setOrden] = useState({});

  const changeModal = () => {
    setVisible(!visible);
  };

  const changeSucursal = (value) => {
    setOrden(value);
    changeModal();
  };

  return (
    <div>
      <HeadingBack title='Ordenes de Compra' />
      <OrdenesCompraList
        onClickItem={changeSucursal}
        //editItem={showModal}
        //onConfirmDelete={onConfirmDelete}
      />
      <br />
      <Link to='/ordenes-compra/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nueva Orden de Compra
        </Button>
      </Link>
      <ModalOrdenesCompra
        visible={visible}
        orden={orden}
        setVis={changeModal}
      />
    </div>
  );
};

export default Index;
