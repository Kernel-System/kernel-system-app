import { http } from 'api';

export const getItems = (token) => {
  return http.get(
    '/items/inventario?fields=*, clave_almacen.clave_sucursal, clave_almacen.clave, codigo_producto.*, series_inventario.*',
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
