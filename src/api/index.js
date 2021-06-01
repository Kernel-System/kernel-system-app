import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://localhost:8055',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk2NGIyNjRiLTdmMzktNDZlOC1hZmEwLWVjM2ZjYmQ1MWY3YSIsImlhdCI6MTYyMjA0NTM1OSwiZXhwIjoxNjIyMDgxMzU5fQ.zmawzwZG6gYUvkOptFuGeJ6C5aGDoSKohjD3jJ2aMxs`,
  },
});
