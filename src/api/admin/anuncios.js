import { http } from 'api';

export const insertAnuncio = (newAnuncio, token) =>
  http.post('/items/anuncios', newAnuncio, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAnuncio = (id) =>
  http.get(`/items/anuncios/${id}?fields=id,titulo,imagen,url`);

export const getAnuncios = () =>
  http.get('/items/anuncios?fields=id,titulo,imagen,url');

export const updateAnuncio = (id, updatedAnuncio, token) =>
  http.patch(`/items/anuncios/${id}`, updatedAnuncio, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteAnuncio = (id, imageId, token) =>
  Promise.all([
    http.delete(`/files/${imageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    http.delete(`/items/anuncios/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);
