import axios from 'axios';

export const http = axios.create({
  baseURL: process.env.REACT_APP_DIRECTUS_API_URL,
});

export const httpSAT = axios.create({
  baseURL: process.env.REACT_APP_FACTURA_API_URL,
  headers: {
    contentType: 'application/json',
    Authorization: `Basic ${process.env.REACT_APP_FACTURA_TOKEN_URL}`,
  },
});

export const url = process.env.REACT_APP_DIRECTUS_API_URL;
