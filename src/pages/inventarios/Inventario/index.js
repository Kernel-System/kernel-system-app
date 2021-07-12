import InventarioList from 'components/list/InventarioList';
import ModalMovimiento from 'components/inventario/ModalInventario';
import HeadingBack from 'components/UI/HeadingBack';
import { useState } from 'react';

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [movimiento, setMovimiento] = useState({});

  const showModal = (element) => {
    // console.log({ element });
    setMovimiento(element);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <>
      <HeadingBack title={`Inventario`} />
      <InventarioList onClickItem={showModal} seeItem={showModal} />
      <br />
      <ModalMovimiento
        visible={visible}
        inventario={movimiento}
        hideModal={hideModal}
      />
    </>
  );
};

export default Index;
