import { http } from 'api';

export const filtrarPorProveedor = (rfc, token) => {
  return http.get(
    `/items/facturas_externas?filter[rfc_emisor][_eq]=${rfc}`,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const insertItems = (values, token) => {
  return http.post(
    '/items/facturas_externas',
    values,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getItems = (sort, token) => {
  return http.get(
    `/items/facturas_externas?fields=*, cfdis_relacionados.*&sort[]=${
      sort === 'recent' ? '-' : '+'
    }fecha`,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const filtrarPorUUID = (uuid, token) => {
  return http.get(
    `/items/facturas_externas?filter[uuid][_eq]=${uuid}`,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deleteItem = async (values, token) => {
  return http.delete(
    '/items/facturas_externas/' + values.id,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
