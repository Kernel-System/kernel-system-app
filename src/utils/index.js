export const updateObject = (oldObject, updatedValues) => ({
  ...oldObject,
  ...updatedValues,
});

export const formatPrice = (price) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price);
