import { Modal } from 'antd';
import { http } from 'api';
import BoughtProductsListWithSeries from 'components/shared/BoughtProductsListWithSeries';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import Descripciones from 'components/descriptions/MovimientoDescription';

const Index = ({ visible, movimiento, hideModal }) => {
  const [productosConImagenes, setImagenes] = useState(
    movimiento.productos_movimiento
  );
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (movimiento?.productos_movimiento) {
      const codigosImagenes = [];
      movimiento.productos_movimiento.forEach((producto) => {
        codigosImagenes.push(producto.codigo);
      });
      http
        .get(
          `/items/productos?fields=codigo,titulo,imagenes.directus_files_id&filter[codigo][_in]=${codigosImagenes.toString()}`,
          putToken
        )
        .then((result) => {
          onSetImagenes(result.data.data);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movimiento]);

  const onSetImagenes = (lista) => {
    const newLista = [];
    // console.log({newLista})
    movimiento?.productos_movimiento?.forEach((producto) => {
      const productoConImagenes = lista.find(
        (prod) => prod.codigo === producto.codigo
      );
      newLista.push({ ...productoConImagenes, ...producto });
    });
    setImagenes(newLista);
  };

  return (
    <>
      <Modal
        title={`Movimiento No. ${movimiento.id}`}
        centered
        visible={visible}
        onCancel={hideModal}
        width={'85%'}
        footer={null}
      >
        <Descripciones movimiento={movimiento}>
          <BoughtProductsListWithSeries products={productosConImagenes} />
        </Descripciones>
      </Modal>
    </>
  );
};

export default Index;
