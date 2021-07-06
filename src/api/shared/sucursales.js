import { http } from 'api';

export const getSucursales = () =>
  http.get('/items/sucursales?fields=clave,nombre');
