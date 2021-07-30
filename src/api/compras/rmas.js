import { http } from 'api';

export const getItems = (sort, token) => {
  return http.get(
    `/items/rmas?fields=estado, fecha, folio, id
    , compra.no_compra, compra.proveedor.rfc, compra.proveedor.razon_social, compra.proveedor.regimen_fiscal, compra.proveedor.contacto
    , productos_rma.id, productos_rma.problema, productos_rma.serie, productos_rma.rma, productos_rma.estado
    , productos_rma.producto_comprado.descripcion, productos_rma.producto_comprado.codigo, productos_rma.producto_comprado.unidad, productos_rma.producto_comprado.id
    &sort[]=${sort === 'recent' ? '-' : '+'}fecha`,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getItemsMovimiento = (sort, token) => {
  return http.get(
    `/items/rmas?fields=estado, fecha, folio, id
      , compra.no_compra, compra.proveedor.rfc
      , productos_rma.id, productos_rma.problema, productos_rma.serie, productos_rma.rma, productos_rma.estado
      , productos_rma.producto_comprado.id
      , productos_rma.producto_comprado.producto_catalogo.tipo_de_venta, productos_rma.producto_comprado.codigo
      &sort[]=${!sort || sort === 'recent' ? '-' : '+'}fecha`,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const insertItems = (values, token) => {
  return http.post(
    '/items/rmas',
    values,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const updateItem = (values, token) => {
  return http.patch(
    '/items/rmas/' + values.id,
    values,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deleteItem = async (values, token) => {
  return http.delete(
    '/items/rmas/' + values.id,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
