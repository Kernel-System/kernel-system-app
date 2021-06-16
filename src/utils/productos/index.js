export const calcPrecioVariable = (producto, nivel) => {
  let newPrecioVariable = producto.precio_fijo;
  switch (nivel) {
    case 1:
      newPrecioVariable = producto.precios_variables[0].precio_1;
      break;
    case 2:
      newPrecioVariable = producto.precios_variables[0].precio_2;
      break;
    case 3:
      newPrecioVariable = producto.precios_variables[0].precio_3;
      break;
    case undefined:
      newPrecioVariable = producto.precio_fijo;
      break;
    default:
      break;
  }
  return newPrecioVariable;
};

export const calcCantidad = (product) =>
  product.inventario.reduce((acc, product) => acc + product.cantidad, 0);
