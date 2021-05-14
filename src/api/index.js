import axios from 'axios';

export const http = axios.create({
  baseURL: 'https://kernel-system-api.herokuapp.com/',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk2NGIyNjRiLTdmMzktNDZlOC1hZmEwLWVjM2ZjYmQ1MWY3YSIsImlhdCI6MTYyMTAyMTUzMSwiZXhwIjoxNjIxMDI1MTMxfQ.qAt8HPaWGNJhXhgfEg-glWQgZYY7nIfdk1O2uL8i0T0`,
  },
});
