import { http } from 'api';

export const getHomeProducts = async () =>
  http.get(
    `/items/productos?fields=codigo,titulo,costo,descuento,tipo_de_venta,precios_variables.*,imagenes.directus_files_id,categorias.categorias_id.nombre&filter[inventario][id][_nnull]=true`
  );

export const getProduct = async (id) =>
  http.get(
    `/items/productos/${id}?fields=codigo,titulo,sku,costo,descripcion,descuento,ieps,peso,unidad_de_medida,imagenes.directus_files_id,inventario.cantidad,categorias.categorias_id.nombre`
  );

export const getRelatedProducts = async () =>
  http.get(
    `/items/productos?fields=codigo,titulo,costo,descuento,imagenes.directus_files_id,categorias.categorias_id.nombre&filter[inventario][id][_nnull]=true&limit=4`
  );

export const getCartProducts = async (cartItems) => {
  const cartItemsIds = cartItems.map((cartItem) => cartItem.id);
  return http.get(
    `/items/productos?fields=codigo,titulo,costo,descuento,iva,imagenes.directus_files_id&filter[codigo][_in]=${cartItemsIds.toString()}`
  );
};

export const getProductsByName = async (name, sortBy) =>
  http.get(
    `/items/productos?fields=codigo,titulo,costo,descuento,imagenes.directus_files_id,categorias.categorias_id.nombre&filter={"_and":[{"titulo":{"_contains":"${name}"},"inventario":{"id":{"_nnull":true}}}]}&sort=${
      sortBy === 'menor' ? 'costo' : sortBy === 'mayor' ? '-costo' : 'titulo'
    }`
  );

export const getProductsByCategory = async (category, sortBy) =>
  http.get(
    `/items/productos?fields=codigo,titulo,costo,descuento,imagenes.directus_files_id,categorias.categorias_id.nombre&filter={"_and":[{"categorias":{"categorias_id":{"nombre":{"_contains":"${category}"}}},"inventario":{"id":{"_nnull":true}}}]}&sort=${
      sortBy === 'menor' ? 'costo' : sortBy === 'mayor' ? '-costo' : 'titulo'
    }`
  );
