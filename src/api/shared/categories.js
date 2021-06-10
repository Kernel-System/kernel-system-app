import { http } from 'api';

export const getCategories = async () => {
  const { data } = await http.get(
    '/items/productos_categorias?fields=categorias_id.id,categorias_id.nombre&filter[productos_codigo][inventario][id][_nnull]=true'
  );
  return data.data.filter(
    (category, i, array) =>
      array.findIndex(
        (cat) => cat.categorias_id.nombre === category.categorias_id.nombre
      ) === i
  );
};
