import { useEffect, useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { http, httpSAT } from 'api';

const Index = () => {
  const [ventas, setVentas] = useState([]);
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    http
      .get(
        `/items/ventas/?fields=*, id_cliente.rfc,productos_venta.*, productos_venta.codigo.*`,
        putToken
      )
      .then((result) => {
        onSetArreglo(result.data.data, setVentas);
      });
  }, []);

  const onSetArreglo = (lista, asignar) => {
    asignar(lista && Array.isArray(lista) ? lista.slice() : []);
  };

  return <div></div>;
};

//numero de venta
//diagnostico
//Nota
//Productos

export default Index;
