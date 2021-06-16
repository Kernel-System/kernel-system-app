import { http } from 'api';

export const filtrarPorProveedor = (rfc, token) => {
  return http.get(
    `/items/facturas_internas?filter[rfc_receptor][_eq]=${rfc}`,
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};

export const insertItems = (values, token) => {
  return http.post(
    '/items/facturas_internas',
    values,
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};

export const getItems = (sort, token) => {
  return http.get(
    `/items/facturas_internas?&sort[]=${sort === 'recent' ? '-' : '+'}fecha`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const filtrarPorUUID = (uuid, token) => {
  return http.get(
    `/items/facturas_internas?filter[uuid][_eq]=${uuid}`,
    token === undefined
      ? token
      : {
          headers: { Authorization: `Bearer ${token}` },
        }
  );
};

export const deleteItem = async (values, token) => {
  return http.delete('/items/facturas_internas/' + values.folio, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
