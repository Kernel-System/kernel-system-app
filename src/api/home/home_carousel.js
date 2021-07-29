import { http } from 'api';

export const getHomeAnuncios = () =>
  http.get('/items/anuncios?fields=id,titulo,imagen,url&limit=10');
