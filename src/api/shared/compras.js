import { http } from 'api';

export const getItems = (token) => {
  return http.get(
    '/items/compras?fields=*, productos_comprados.*, factura.*',
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};

export const insertItems = (values, token) => {
  return http.post(
    '/items/compras',
    values,
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};

export const updateItem = (values, token) => {
  return http.patch(
    '/items/compras/' + values.no_compra,
    values,
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};

export const deleteItem = async (values, token) => {
  return http.delete(
    '/items/compras/' + values.no_compra,
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};