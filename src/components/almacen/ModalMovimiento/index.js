import { Divider, Modal } from 'antd';
import { http } from 'api';
import BoughtProductsListWithSeries from 'components/shared/BoughtProductsListWithSeries';
import TextLabel from 'components/UI/TextLabel';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';

const Index = ({ visible, movimiento, hideModal }) => {
  const [imagenes, setImagenes] = useState(movimiento.productos_movimiento);
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const codigosImagenes = [];

    movimiento?.productos_movimiento?.forEach((producto) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movimiento]);

  const onSetImagenes = (lista) => {
    const newLista = [];
    lista.forEach((producto, index) => {
      newLista.push({ ...movimiento.productos_movimiento[index], ...producto });
    });
    setImagenes(newLista);
  };
  return (
    <>
      <Modal
        title={`Ensamble No. ${movimiento.id}`}
        centered
        visible={visible}
        onCancel={hideModal}
        width={'85%'}
        footer={null}
      >
        <TextLabel title='Fecha' subtitle={movimiento.fecha} />
        <TextLabel title='Concepto' subtitle={movimiento.concepto} />
        <TextLabel title='Almacén' subtitle={movimiento.clave_almacen} />
        <TextLabel
          title='Empleado'
          subtitle={movimiento.rfc_empleado?.nombre}
        />
        {movimiento.comentario !== null ? (
          <TextLabel title='Comentario' subtitle={`${movimiento.comentario}`} />
        ) : null}
        <TextLabel title='Justificación:' />
        {movimiento.rma !== null ? (
          <TextLabel title='Folio de RMA' subtitle={movimiento.rma} />
        ) : null}
        {movimiento?.compras !== null ? (
          <TextLabel
            title='Número de Compra'
            subtitle={`${movimiento.compras}`}
          />
        ) : null}
        {movimiento?.ventas !== null ? (
          <TextLabel
            title='Número de Ventas'
            subtitle={`${movimiento.ventas}`}
          />
        ) : null}
        {movimiento?.factura?.length !== 0 ? (
          <TextLabel
            title='Número de Factura'
            subtitle={`${movimiento.factura}`}
          />
        ) : null}
        {movimiento.devolucion_clientes !== null ? (
          <TextLabel
            title='Número de Devolución'
            subtitle={movimiento.devolucion_clientes}
          />
        ) : null}
        {movimiento.folio_ensamble !== null ? (
          <TextLabel
            title='Folio de Ensamble'
            subtitle={`${movimiento.folio_ensamble}`}
          />
        ) : null}
        {movimiento.no_transferencia !== null ? (
          <TextLabel
            title='Solicitud de Transferencia'
            subtitle={movimiento.no_transferencia}
          />
        ) : null}
        <Divider />
        <TextLabel title='Productos con series' />
        <BoughtProductsListWithSeries products={imagenes} />
      </Modal>
    </>
  );
};

export default Index;
