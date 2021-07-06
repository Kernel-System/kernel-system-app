export const calcPrecioVariable = (producto, nivel) => {
  let newPrecioVariable = producto.precio_fijo;
  if (producto.precios_variables.length) {
    if (producto.tipo_de_venta === 'Volumen') {
      if (producto.cantidad < producto.precios_variables[0].valor_2) {
        return (newPrecioVariable = producto.precios_variables[0].precio_1);
      } else if (
        producto.cantidad >= producto.precios_variables[0].valor_2 &&
        producto.cantidad < producto.precios_variables[0].valor_3
      ) {
        return (newPrecioVariable = producto.precios_variables[0].precio_2);
      } else if (
        producto.cantidad >= producto.precios_variables[0].valor_3 &&
        producto.cantidad < producto.precios_variables[0].valor_4
      ) {
        return (newPrecioVariable = producto.precios_variables[0].precio_3);
      } else if (producto.cantidad >= producto.precios_variables[0].valor_4) {
        return (newPrecioVariable = producto.precios_variables[0].precio_4);
      }
    } else {
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
  }
  return newPrecioVariable;
};

export const calcCantidad = (product) =>
  product.inventario.reduce((acc, product) => acc + product.cantidad, 0);
