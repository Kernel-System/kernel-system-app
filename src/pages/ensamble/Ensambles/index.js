import EnsambleList from 'components/list/EnsambleList';

const index = () => {
  const listaEnsambles = [
    { folio: 'Folio 001', fechaorden: '01/01/2020', estado: 'Creado' },
  ];
  return (
    <div>
      <EnsambleList list={listaEnsambles} />
    </div>
  );
};

export default index;
