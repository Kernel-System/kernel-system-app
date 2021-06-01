import { http } from 'api';

export const getUserOrders = (rfc, token) =>
  http.get(
    `/items/solicitudes_compra?fields=id,fecha_solicitud,total,rfc_cliente.razon_social,productos_solicitados.id,productos_solicitados.cantidad,productos_solicitados.codigo_producto.titulo,productos_solicitados.codigo_producto.codigo,productos_solicitados.codigo_producto.imagenes.directus_files_id&filter=[rfc_cliente][_eq]=${rfc}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const getUserOrder = (id, token) =>
  http.get(
    `/items/solicitudes_compra/${id}?fields=id,fecha_solicitud,total,rfc_cliente.razon_social,rfc_cliente.telefono,productos_solicitados.id,productos_solicitados.cantidad,productos_solicitados.codigo_producto.titulo,productos_solicitados.codigo_producto.codigo,productos_solicitados.codigo_producto.imagenes.directus_files_id`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
