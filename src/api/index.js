import axios from 'axios';

export const http = axios.create({
  baseURL: process.env.REACT_APP_DIRECTUS_API_URL,
});

export const url = process.env.REACT_APP_DIRECTUS_API_URL;
