import CuentasList from 'components/list/CuentasList';

const index = () => {
  const lista = [
    {
      id_factura: '0000001',
      estado: 'Sin Finalizar',
      folio: '12000120',
      fecha: '01/01/2021',
    },
  ];
  return (
    <>
      <CuentasList list={lista} />
    </>
  );
};

export default index;
