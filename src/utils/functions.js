export const updateObject = (oldObject, updatedValues) => ({
  ...oldObject,
  ...updatedValues,
});

export const isEmptyObject = (obj) => {
  return JSON.stringify(obj) === '{}';
};

export const toPercent = (descuento) => {
  return 1 - descuento / 100;
};

export const formatDate = (date) =>
  new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'short',
  }).format(new Date(date));

export const formatDateTime = (date) =>
  new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));

export const formatPrice = (price) =>
  new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'MXN',
  }).format(price);

export const formatPhoneNumber = (phoneNumber) =>
  phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

export const csvToArray = (str, delimiter = ',') => {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf('\n')).split(delimiter);
  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf('\n') + 1).split('\n');
  rows.pop();
  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });
  // return the array
  return arr;
};
