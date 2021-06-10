import { http } from 'api';

export const filtrarPorProveedor = (rfc, token) => {
  return http.get(
    `/items/facturas_externas?filter[rfc_emisor][_eq]=${rfc}`,
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};

export const insertItems = (values, token) => {
  return http.post(
    '/items/facturas_externas',
    values,
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};

export const getItems = (token) => {
  return http.get(
    '/items/facturas_externas?fields=*, cfdis_relacionados.*',
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};

export const filtrarPorUUID = (uuid, token) => {
  return http.get(
    `/items/facturas_externas?filter[uuid][_eq]=${uuid}`,
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};

export const deleteItem = async (values, token) => {
  return http.delete(
    '/items/facturas_externas/' + values.id,
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};
