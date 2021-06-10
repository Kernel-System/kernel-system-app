import { http } from 'api';

export const getToken = (email, password) =>
  http.post('/auth/login', { email, password });

export const refreshToken = (token) =>
  http.post('/auth/refresh', { refresh_token: token });

export const logout = (token) =>
  http.post('/auth/logout', { refresh_token: token });

// FALTA RUTA DE REDIRECT
export const recoverAccount = (email) =>
  http.post('/auth/password/request', { email });

export const resetPassword = (token, password) =>
  http.post('/auth/password/reset', {
    token,
    password,
  });

export const getUserRole = (token) =>
  http.get('/users/me?fields=role.name', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUserNivel = (token) =>
  http.get('/users/me?fields=cliente.nivel', {
    headers: { Authorization: `Bearer ${token}` },
  });
