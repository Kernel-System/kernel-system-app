import { http } from 'api';

export const getSolicitudesCompra = (rfc, page, filter, token) =>
  http.get(
    `/items/solicitudes_compra?fields=id,estado,fecha_solicitud,id_cliente.nombre_comercial${
      filter === 'todos' ? '' : `&filter[estado][_eq]=${filter}`
    }${
      rfc !== '' ? `&filter[id_cliente][rfc][_eq]=${rfc}` : ''
    }&page=${page}&limit=10&sort=-fecha_solicitud&meta=filter_count`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const getSolicitudCompra = (id, token) =>
  http.get(
    `/items/solicitudes_compra/${id}?fields=id,estado,comentarios,fecha_solicitud,fecha_ultima_revision,forma_de_pago,metodo_de_pago,tipo_de_entrega,total,sucursal.clave,sucursal.nombre,id_cliente.rfc,id_cliente.razon_social,id_cliente.nombre_comercial,id_cliente.nivel,id_cliente.telefono,id_cliente.domicilios_cliente.*,productos_solicitados.*,productos_solicitados.codigo_producto.codigo,productos_solicitados.codigo_producto.clave,productos_solicitados.codigo_producto.titulo,productos_solicitados.codigo_producto.tipo_de_venta,productos_solicitados.codigo_producto.precios_variables.*,productos_solicitados.codigo_producto.precio_fijo,productos_solicitados.codigo_producto.inventario.cantidad,productos_solicitados.codigo_producto.imagenes.directus_files_id&deep={"id_cliente":{"domicilios_cliente":{"_filter":{"fiscal":{"_eq":"1"}}}}}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const updateSolicitudCompra = (id, updatedSolicitud, token) =>
  http.patch(`/items/solicitudes_compra/${id}`, updatedSolicitud, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getClienteData = (rfc, token) =>
  http.get(
    `/items/clientes?fields=rfc,razon_social,nombre_comercial,nivel,telefono,domicilios_cliente.*&filter[rfc][_eq]=${rfc}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
