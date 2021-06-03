import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://localhost:8055',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk2NGIyNjRiLTdmMzktNDZlOC1hZmEwLWVjM2ZjYmQ1MWY3YSIsImlhdCI6MTYyMjczNTUyNiwiZXhwIjoxNjIyNzcxNTI2fQ.pNM32fqJqHlPynn9WjmPGNIzCRqYWn6RHrrDdS8plHE`,
  },
});

export const url = 'http://localhost:8055';
