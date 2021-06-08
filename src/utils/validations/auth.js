export const emailRules = [
  {
    required: true,
    message: 'Por favor introduzca su correo electrónico',
  },
  {
    type: 'email',
    message: 'Por favor introduzca un correo electrónico válido',
  },
];

export const passwordRules = [
  {
    required: true,
    message: 'Por favor introduzca su nueva contraseña',
  },
  {
    min: 8,
    message:
      'La contraseña debe tener al menos 8 caracteres (hasta 32 caracteres)',
  },
  {
    max: 32,
    message: 'La contraseña debe tener hasta 32 caracteres',
  },
];
