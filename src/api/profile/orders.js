import { http } from 'api';

export const getUserOrders = (id, page, year, token) =>
  http.get(
    `/items/solicitudes_compra?fields=id,estado,fecha_solicitud,total,productos_solicitados.precio_ofrecido,productos_solicitados.descuento_ofrecido,productos_solicitados.id,productos_solicitados.cantidad,productos_solicitados.codigo_producto.titulo,productos_solicitados.codigo_producto.codigo,productos_solicitados.codigo_producto.imagenes.directus_files_id,productos_solicitados.codigo_producto.descuento,productos_solicitados.codigo_producto.precios_variables.*&filter={"_and":[{"fecha_solicitud":{"_contains":${year}}},{"id_cliente":{"_eq":${id}}}]}&page=${page}&limit=3&meta=filter_count`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const getUserOrdersYears = (id, token) =>
  http.get(
    `/items/solicitudes_compra?fields=id,fecha_solicitud&filter[id_cliente][_eq]=${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const getUserOrder = (id, token) =>
  http.get(
    `/items/solicitudes_compra/${id}?fields=id,estado,fecha_solicitud,total,id_cliente.telefono,productos_solicitados.precio_ofrecido,productos_solicitados.descuento_ofrecido,productos_solicitados.id,productos_solicitados.cantidad,productos_solicitados.codigo_producto.titulo,productos_solicitados.codigo_producto.codigo,productos_solicitados.codigo_producto.imagenes.directus_files_id`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
