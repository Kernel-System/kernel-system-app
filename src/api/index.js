import axios from 'axios';

export const http = axios.create({
  baseURL: process.env.REACT_APP_DIRECTUS_API_URL,
});

export const url = 'http://kernel-system-api.herokuapp.com';
