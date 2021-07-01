import { http } from 'api';

export const getProductCodes = (token) =>
  http.get(`/items/productos?fields=codigo`);

export const getProductTitleCodePairs = (token) =>
  http.get(`/items/productos?fields=codigo,titulo`);

export const getHomeProducts = () =>
  http.get(
    '/items/productos?fields=codigo,titulo,costo,descuento,tipo_de_venta,precio_fijo,precios_variables.*,imagenes.directus_files_id,categorias.categorias_id.nombre&filter[inventario][id][_nnull]=true'
  );

export const getProduct = (id) =>
  http.get(
    `/items/productos/${id}?fields=codigo,titulo,sku,costo,descripcion,descuento,tipo_de_venta,precio_fijo,precios_variables.*,ieps,peso,unidad_de_medida,nombre_unidad_cfdi,imagenes.directus_files_id,inventario.cantidad,categorias.categorias_id.nombre`
  );

export const getRelatedProducts = (fromProduct, categorias) => {
  const categoriasNombres = categorias.map(
    (categorias) => categorias.categorias_id.nombre
  );
  return http.get(
    `/items/productos?fields=codigo,titulo,costo,descuento,tipo_de_venta,precio_fijo,precios_variables.*,imagenes.directus_files_id,categorias.categorias_id.nombre&filter={"_and":[{"categorias":{"categorias_id":{"nombre":{"_in":"${categoriasNombres.toString()}"}}}},{"inventario":{"id":{"_nnull":true}}},{"codigo":{"_neq":"${fromProduct}"}}]}&limit=4`
  );
};

export const getCartProducts = (cartItems) => {
  const cartItemsIds = cartItems.map((cartItem) => cartItem.id);
  return http.get(
    `/items/productos?fields=codigo,titulo,costo,descuento,tipo_de_venta,precio_fijo,precios_variables.*,iva,imagenes.directus_files_id,inventario.cantidad&filter[codigo][_in]=${cartItemsIds.toString()}`
  );
};

export const getProductsByName = (name, sortBy) =>
  http.get(
    `/items/productos?fields=codigo,titulo,costo,descuento,tipo_de_venta,precio_fijo,precios_variables.*,imagenes.directus_files_id,categorias.categorias_id.nombre&filter={"_and":[{"titulo":{"_contains":"${name}"},"inventario":{"id":{"_nnull":true}}}]}&sort=${
      sortBy === 'menor' ? 'costo' : sortBy === 'mayor' ? '-costo' : 'titulo'
    }`
  );

export const getProductsByCategory = (category, sortBy) =>
  http.get(
    `/items/productos?fields=codigo,titulo,costo,descuento,tipo_de_venta,precio_fijo,precios_variables.*,imagenes.directus_files_id,categorias.categorias_id.nombre&filter={"_and":[{"categorias":{"categorias_id":{"nombre":{"_contains":"${category}"}}},"inventario":{"id":{"_nnull":true}}}]}&sort=${
      sortBy === 'menor' ? 'costo' : sortBy === 'mayor' ? '-costo' : 'titulo'
    }`
  );
