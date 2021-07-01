import React from 'react';
import { MemoizedProductoItem as ProductoItem } from '../ProductoCompradoListItem';
import { Empty, List } from 'antd';

const cumpleFiltroRfc = (item, rfc) => (rfc ? item.rfc_emisor === rfc : true);
const cumpleFiltroNombre = (item, nombre) =>
  nombre
    ? item.nombre_emisor.toUpperCase().includes(nombre.toUpperCase())
    : true;

const cumpleFiltroPendiente = (item, pendiente) => {
  switch (pendiente) {
    case 'entregado':
      return item.cantidad_ingresada >= item.cantidad;
    case 'falta-ingresar':
      return item.cantidad - item.cantidad_ingresada > 0;
    default:
      return true;
  }
};
const cumpleFiltroCodigo = (item, filtroCodigo) => {
  switch (filtroCodigo) {
    case 'con-codigo':
      return item.producto_catalogo;
    case 'sin-codigo':
      return !item.producto_catalogo;
    default:
      return true;
  }
};

const ProductosCompradosData = ({
  data,
  rfcSearch,
  nombreSearch,
  pendienteSearch,
  codigoSearch,
  onClickItem,
  editItem,
}) => {
  const dataToRender = data.reduce((acc, item, index) => {
    cumpleFiltroRfc(item, rfcSearch) &&
      cumpleFiltroNombre(item, nombreSearch) &&
      cumpleFiltroPendiente(item, pendienteSearch) &&
      cumpleFiltroCodigo(item, codigoSearch) &&
      acc.push(
        <ProductoItem
          item={item}
          index={index}
          key={index}
          onClickItem={onClickItem}
          editItem={editItem}
        />
      );
    return acc;
  }, []);

  return (
    <List
      itemLayout='horizontal'
      size='default'
      pagination={{
        onChange: (page) => {},
        pageSize: 20,
      }}
    >
      {dataToRender.length ? (
        dataToRender
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </List>
  );
};

export default ProductosCompradosData;
