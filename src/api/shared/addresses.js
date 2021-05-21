import { http } from 'api';

export const insertUserDireccion = (newAddress, token) =>
  http.post(`/items/domicilios_cliente`, newAddress, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUserDirecciones = (rfc, token) =>
  http.get(`/items/domicilios_cliente?filter[rfc_cliente][_eq]=${rfc}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUserDireccion = (id, token) =>
  http.get(
    `/items/domicilios_cliente/${id}?fields=id,estado,municipio,localidad,calle,no_ext,no_int,colonia,cp,entre_calle_1,entre_calle_2,pais`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const getUserDireccionesCount = (rfc, token) =>
  http.get(
    `/items/domicilios_cliente?filter[rfc_cliente][_eq]=${rfc}&meta=total_count`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const getUserDireccionesEnvio = (rfc, token) =>
  http.get(
    `/items/domicilios_cliente?filter[rfc_cliente][_eq]=${rfc}&filter[fiscal][_eq]=false`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const getUserDireccionesFacturacion = (rfc, token) =>
  http.get(
    `/items/domicilios_cliente?filter[rfc_cliente][_eq]=${rfc}&filter[fiscal][_eq]=true`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const updateUserDireccion = (id, updatedAddress, token) =>
  http.patch(`/items/domicilios_cliente/${id}`, updatedAddress, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUserDireccion = (id, token) =>
  http.delete(`/items/domicilios_cliente/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
