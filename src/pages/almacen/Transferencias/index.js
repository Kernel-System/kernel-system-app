import TransferenciasList from 'components/list/TransferenciasList';

const index = () => {
  const list = [
    {
      id: '00001',
      estado: 'Pendiente',
      fechasolicitud: '01/01/21',
      almacen_origen: '1',
      almacen_destino: '2',
    },
  ];
  return (
    <div>
      <TransferenciasList list={list} />
    </div>
  );
};

export default index;
