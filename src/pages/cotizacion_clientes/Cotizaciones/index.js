import CotizacionesList from 'components/list/CotizacionesList';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Modal from 'components/cotizacion/ModalCotizacion';
import { useState } from 'react';
import HeadingBack from 'components/UI/HeadingBack';

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [cotizacion, setCotizacion] = useState({});

  const changeModal = () => {
    setVisible(!visible);
  };

  const changeSucursal = (value) => {
    setCotizacion(value);
    changeModal();
  };

  return (
    <div>
      <HeadingBack title='Cotizaciones' />
      <CotizacionesList
        onClickItem={changeSucursal}
        //editItem={showModal}
        //onConfirmDelete={onConfirmDelete}
      />
      <br />
      <Link to='/cotizacion-cliente/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nuevo Cliente
        </Button>
      </Link>
      <Modal visible={visible} cotizacion={cotizacion} setVis={changeModal} />
    </div>
  );
};

export default Index;
