import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://localhost:8055',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk2NGIyNjRiLTdmMzktNDZlOC1hZmEwLWVjM2ZjYmQ1MWY3YSIsImlhdCI6MTYyMTM2NTQ5NywiZXhwIjoxNjIxMzY5MDk3fQ.WUi0jT3IJf1zQKuQf701qiZ74QCMDf-fHx6-3d8wcqQ`,
  },
});
