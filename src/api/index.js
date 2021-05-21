import axios from 'axios';

export const http = axios.create({
  baseURL: 'https://kernel-system-api.herokuapp.com',
});
