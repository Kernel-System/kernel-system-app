import { http } from 'api';

export const getItems = (token) => {
  const url = `/items/productos_comprados?fields=*, no_compra.*, no_compra.factura.*`;
  return http.get(
    url,
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};

export const updateItem = (values, token) => {
  return http.patch(
    '/items/productos_comprados/' + values.id,
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
    '/items/productos_comprados/' + values.id,
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};
