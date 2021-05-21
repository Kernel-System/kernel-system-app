export let calleRules, coloniaRules, municipioRules;
export let entreCalleRules, localidadRules;

calleRules = coloniaRules = localidadRules = municipioRules = [
  { max: 100, message: 'Ha excedido el número de caracteres permitidos' },
  { required: true, message: 'Campo requerido' },
];

export const noExtRules = [
  { max: 6, message: 'Ha excedido el número de caracteres permitidos' },
  { required: true, message: 'Campo requerido' },
  {
    pattern: '^(\\d)*$',
    message: 'Favor de utilizar solo valores numéricos',
  },
];

export const noIntRules = [
  { max: 10, message: 'Ha excedido el número de caracteres permitidos' },
];

entreCalleRules = localidadRules = [
  { max: 100, message: 'Ha excedido el número de caracteres permitidos' },
];

export const cpRules = [
  { max: 5, message: 'Ha excedido el número de caracteres permitidos' },
  { len: 5, message: 'El número de caracteres deben ser 5' },
  { required: true, message: 'Campo requerido' },
  {
    pattern: '^(\\d)*$',
    message: 'Favor de utilizar solo valores numéricos',
  },
];

export const estadoRules = [
  { max: 45, message: 'Ha excedido el número de caracteres permitidos' },
  { required: true, message: 'Campo requerido' },
];

export const paisRules = [
  { max: 60, message: 'Ha excedido el número de caracteres permitidos' },
  { required: true, message: 'Campo requerido' },
];
