export const updateObject = (oldObject, updatedValues) => ({
  ...oldObject,
  ...updatedValues,
});

export const isEmptyObject = (obj) => {
  return JSON.stringify(obj) === '{}';
};

export const formatDate = (date) =>
  new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));

export const formatPrice = (price) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price);

export const formatPhoneNumber = (phoneNumber) =>
  phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
