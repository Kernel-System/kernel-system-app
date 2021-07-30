import { http } from 'api';

export const getItems = (sort, token) => {
  return http.get(
    `/items/compras?fields=*, productos_comprados.*, factura.*&sort[]=${
      sort === 'recent' ? '-' : '+'
    }fecha_compra`,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getComprasRMA = (sort, token) => {
  return http.get(
    `/items/compras?fields=no_compra, fecha_compra
    , factura.folio, factura.serie
    , proveedor.rfc, proveedor.razon_social, proveedor.regimen_fiscal, proveedor.contacto
    , productos_comprados.*
    &sort[]=${sort === 'recent' ? '-' : '+'}fecha_compra`,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const insertItems = (values, token) => {
  return http.post(
    '/items/compras',
    values,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const updateItem = (values, token) => {
  return http.patch(
    '/items/compras/' + values.no_compra,
    values,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deleteItem = async (values, token) => {
  return http.delete(
    '/items/compras/' + values.no_compra,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
