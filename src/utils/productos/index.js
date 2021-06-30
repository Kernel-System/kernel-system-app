export const calcPrecioVariable = (producto, nivel) => {
  let newPrecioVariable = producto.precio_fijo;
  if (producto.precios_variables.length) {
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
      default:
        break;
    }
  }
  return newPrecioVariable;
};

export const calcPrecioVolumen = (producto, cantidad) => {
  let newPrecioVariable = producto.precio_fijo;
  if (producto.precios_variables.length) {
    if (cantidad < producto.precios_variables[0].valor_2) {
      return (newPrecioVariable = producto.precios_variables[0].precio_1);
    } else if (
      cantidad >= producto.precios_variables[0].valor_2 &&
      cantidad < producto.precios_variables[0].valor_3
    ) {
      return (newPrecioVariable = producto.precios_variables[0].precio_2);
    } else if (
      cantidad >= producto.precios_variables[0].valor_3 &&
      cantidad < producto.precios_variables[0].valor_4
    ) {
      return (newPrecioVariable = producto.precios_variables[0].precio_3);
    } else if (cantidad >= producto.precios_variables[0].valor_4) {
      return (newPrecioVariable = producto.precios_variables[0].precio_4);
    }
  }

  return newPrecioVariable;
};

export const calcCantidad = (product) =>
  product.inventario.reduce((acc, product) => acc + product.cantidad, 0);
