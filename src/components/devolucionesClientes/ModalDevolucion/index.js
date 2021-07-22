import { Modal, Descriptions } from 'antd';
import { http } from 'api';
import BoughtProductsListWithSeries from 'components/shared/BoughtProductsListWithSeries';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import moment from 'moment';

const formatoFecha = 'DD/MM/YYYY';
const Index = ({ visible, movimiento, hideModal }) => {
  const Item = Descriptions.Item;
  const [productosConImagenes, setImagenes] = useState([]);
  const [movAlm, setMovAlm] = useState([]);
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    if (
      movimiento?.id_movimiento_almacen?.length !== 0 &&
      movimiento?.id_movimiento_almacen !== undefined
    ) {
      console.log(movimiento.id_movimiento_almacen[0]);
      setMovAlm(movimiento.id_movimiento_almacen[0]);
      const codigosImagenes = [];
      movimiento?.id_movimiento_almacen[0]?.productos_movimiento.forEach(
        (producto) => {
          codigosImagenes.push(producto.codigo);
        }
      );
      console.log(codigosImagenes);
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
    movimiento?.id_movimiento_almacen[0]?.productos_movimiento?.forEach(
      (producto, index) => {
        const productoConImagenes = lista.find(
          (prod) => prod.codigo === producto.codigo
        );
        newLista.push({ ...productoConImagenes, ...producto });
      }
    );
    setImagenes(newLista);
  };

  return (
    <>
      <Modal
        title={`Devolución No. ${movimiento.id}`}
        centered
        visible={visible}
        onCancel={hideModal}
        width={'85%'}
        footer={null}
      >
        <Descriptions
          layout='vertical'
          bordered
          className='boldTitles'
          column={2}
        >
          <Item label='Fecha'>
            {moment(new Date(movimiento.fecha)).format(formatoFecha)}
          </Item>
          <Item label='Almacén'>{movAlm?.clave_almacen}</Item>
          <Item label='Empleado'>{movAlm?.rfc_empleado?.nombre}</Item>
          <Item label='Diagnostico'>{movimiento?.diagnostico}</Item>
          <Item label='Venta'>{movimiento?.no_venta}</Item>
          <Item label='Movimiento'>{movAlm?.id}</Item>
          <Item label='Productos' span={2}>
            <BoughtProductsListWithSeries products={productosConImagenes} />
          </Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default Index;
