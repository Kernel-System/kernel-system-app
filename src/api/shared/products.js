import { http } from 'api';

export const getHomeProducts = async () =>
  http.get(
    `/items/productos?fields=codigo,titulo,costo,descuento,imagenes.directus_files_id,categorias.categorias_id.nombre&filter[inventario][id][_nnull]=true`
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
  const { data } = await http.get(
    `/items/productos?fields=codigo,titulo,costo,descuento,imagenes.directus_files_id&filter[codigo][_in]=${cartItemsIds.toString()}`
  );
  return data.data.map((cartItem, i) => ({
    ...cartItem,
    iva: 16,
    cantidad: cartItems[i].quantity,
  }));
};

export const getProductsByName = async (name) =>
  http.get(
    `/items/productos?fields=codigo,titulo,costo,descuento,imagenes.directus_files_id,categorias.categorias_id.nombre&filter={"_and":[{"titulo":{"_contains":"${name}"},"inventario":{"id":{"_nnull":true}}}]}`
  );

export const getProductsByCategory = async (category) =>
  http.get(
    `/items/productos?fields=codigo,titulo,costo,descuento,imagenes.directus_files_id,categorias.categorias_id.nombre&filter={"_and":[{"categorias":{"categorias_id":{"nombre":{"_contains":"${category}"}}},"inventario":{"id":{"_nnull":true}}}]}`
  );
