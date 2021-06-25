import { http } from 'api';

export const insertSolicitudCompra = (solicitud, token) =>
  http.post('/items/solicitudes_compra', solicitud, {
    headers: { Authorization: `Bearer ${token}` },
  });
