import PagosList from 'components/list/PagosList';
import { useEffect } from 'react';

const Index = ({ id_factura }) => {
  const lista = [
    {
      id_pago: '00000001',
      fecha_pago: '01/01/2021',
      num_operacion: '1',
      factura: '00001',
    },
  ];

  return (
    <div>
      <PagosList list={lista} />
    </div>
  );
};

export default Index;
