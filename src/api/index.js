import axios from 'axios';

export const http = axios.create({
  baseURL: 'http://localhost:8055',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk2NGIyNjRiLTdmMzktNDZlOC1hZmEwLWVjM2ZjYmQ1MWY3YSIsImlhdCI6MTYyMTg3MDk4NCwiZXhwIjoxNjIxOTA2OTg0fQ.THpoJH48D0R83NFVDE6W-aI9_hDNl28IpFM4msfv-oY`,
  },
});
