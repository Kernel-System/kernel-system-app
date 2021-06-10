import { http } from 'api';

export const getUserOrders = (id, token) =>
  http.get(
    `/items/solicitudes_compra?fields=id,fecha_solicitud,total,id_cliente.razon_social,productos_solicitados.id,productos_solicitados.cantidad,productos_solicitados.codigo_producto.titulo,productos_solicitados.codigo_producto.codigo,productos_solicitados.codigo_producto.imagenes.directus_files_id&filter=[id_cliente][_eq]=${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const getUserOrder = (id, token) =>
  http.get(
    `/items/solicitudes_compra/${id}?fields=id,fecha_solicitud,total,id_cliente.razon_social,id_cliente.telefono,productos_solicitados.id,productos_solicitados.cantidad,productos_solicitados.codigo_producto.titulo,productos_solicitados.codigo_producto.codigo,productos_solicitados.codigo_producto.imagenes.directus_files_id`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
