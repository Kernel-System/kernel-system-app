import MovimientosAlmacenList from 'components/list/MovimientosAlmacenList';

const index = () => {
  const lista = [
    {
      clave: '0000012',
      concepto: 'Devolución',
      comentario: 'Producto defectuoso.',
      fecha: '05/05/2021',
    },
  ];
  return <MovimientosAlmacenList list={lista} />;
};

export default index;
