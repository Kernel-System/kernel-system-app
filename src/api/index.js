import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://localhost:8055',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk2NGIyNjRiLTdmMzktNDZlOC1hZmEwLWVjM2ZjYmQ1MWY3YSIsImlhdCI6MTYyMjU2MDQ4NSwiZXhwIjoxNjIyNTk2NDg1fQ.CtPkzvBKq4Rl36MaBrRsYt5VnzYOfN1fsmDe-F6rBS0`,
  },
});
