import { http } from 'api';

export const getItems = (token) => {
  return http.get(
    '/items/almacenes',
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
