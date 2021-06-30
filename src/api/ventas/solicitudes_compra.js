import { http } from 'api';

export const getSolicitudesCompra = (page, filter, token) =>
  http.get(
    `/items/solicitudes_compra?fields=id,estado,fecha_solicitud,id_cliente.nombre_comercial${
      filter === 'todos' ? '' : `&filter[estado][_eq]=${filter}`
    }&page=${page}&limit=10&meta=filter_count`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const getSolicitudCompra = (id, token) =>
  http.get(
    `/items/solicitudes_compra/${id}?fields=id,estado,comentarios,fecha_solicitud,fecha_ultima_revision,forma_de_pago,metodo_de_pago,tipo_de_entrega,total,sucursal.clave,sucursal.nombre,id_cliente.nombre_comercial,id_cliente.nivel,id_cliente.telefono,productos_solicitados.*,productos_solicitados.codigo_producto.codigo,productos_solicitados.codigo_producto.titulo,productos_solicitados.codigo_producto.tipo_de_venta,productos_solicitados.codigo_producto.precios_variables.*,productos_solicitados.codigo_producto.precio_fijo,productos_solicitados.codigo_producto.inventario.cantidad,productos_solicitados.codigo_producto.imagenes.directus_files_id`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const updateSolicitudCompra = (id, updatedSolicitud, token) =>
  http.patch(`/items/solicitudes_compra/${id}`, updatedSolicitud, {
    headers: { Authorization: `Bearer ${token}` },
  });
