import { http } from 'api';

export const getItems = (token) => {
  return http.get(
    '/items/proveedores',
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};

export const updateItem = (values, token) => {
  return http.patch(
    '/items/proveedores/' + values.rfc,
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
    '/items/proveedores/' + values.rfc,
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};

export const insertItems = (values, token) => {
  return http.post(
    '/items/proveedores',
    values,
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};
