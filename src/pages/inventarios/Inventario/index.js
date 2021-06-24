import InventarioList from 'components/list/InventarioList';
import ModalMovimiento from 'components/inventario/ModalInventario';
import HeadingBack from 'components/UI/HeadingBack';
import { useState } from 'react';

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [movimiento, setMovimiento] = useState({});
  const [almacen, setAlmacen] = useState({});

  const showModal = (element, tipo) => {
    console.log({ element });
    setMovimiento(element);
    setAlmacen(tipo);
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
        alm={almacen}
        hideModal={hideModal}
      />
    </>
  );
};

export default Index;
