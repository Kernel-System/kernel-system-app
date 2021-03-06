import { http } from 'api';

export const getClienteNivel = (rfc, token) =>
  http.get(`/items/clientes?fields=nivel&filter[rfc][_eq]=${rfc}&limit=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getPuntoDeVentaProducts = (product, token) =>
  http.get(
    `/items/productos?fields=clave,nombre_unidad_cfdi,unidad_cfdi,codigo,titulo,descuento,tipo_de_venta,precio_fijo,precios_variables.*,iva,imagenes.directus_files_id,inventario.clave_almacen,inventario.cantidad&filter={"_and":[{"tipo_de_venta":{"_neq":"Servicio"}}${
      product !== undefined && product !== ''
        ? `,{"_or":[{"titulo":{"_contains":"${product}"}},{"codigo":{"_contains":"${product}"}}]}`
        : ''
    }]}&limit=10`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const getPuntoDeVentaServices = (service, token) =>
  http.get(
    `/items/productos?fields=clave,nombre_unidad_cfdi,unidad_cfdi,codigo,titulo,descuento,tipo_de_venta,precio_fijo,precios_variables.*,iva,imagenes.directus_files_id,inventario.cantidad&filter={"_and":[{"tipo_de_venta":{"_eq":"Servicio"}}${
      service !== undefined && service !== ''
        ? `,{"_or":[{"titulo":{"_contains":"${service}"}},{"codigo":{"_contains":"${service}"}}]}`
        : ''
    }]}&limit=10`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
