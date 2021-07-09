import VentasList from 'components/list/VentasList';
import ModalVentas from 'components/ventas/ModalVentas';
import HeadingBack from 'components/UI/HeadingBack';
import { useState } from 'react';

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [venta, setVenta] = useState({});

  const showModal = (element) => {
    setVenta(element);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <>
      <HeadingBack title={`Ventas`} />
      <VentasList onClickItem={showModal} seeItem={showModal} />
      <br />
      <ModalVentas visible={visible} venta={venta} hideModal={hideModal} />
    </>
  );
};

export default Index;
