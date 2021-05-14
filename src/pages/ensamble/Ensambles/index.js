import EnsambleList from 'components/list/EnsambleList';
import { useEffect, useState } from 'react';
import { http } from 'api';

const Index = () => {
  const [pag, usePag] = useState(1);
  const [list, useList] = useState([]);

  useEffect(() => {
    http
      .get(
        `/items/ordenes_ensamble?offset=${5 * (pag - 1)}&?limit=${
          5 * pag
        }?fields=folio,fechaorden,estado`
      )
      .then((result) => {
        //console.log(result.data)
        ChangeList(result.data.data);
      });
  }, [pag]);

  const ChangeList = (lista) => {
    useList(lista);
  };

  const ChangePag = (pagina) => {
    usePag(pag);
  };

  return (
    <div>
      <EnsambleList list={list} changePag={ChangePag} />
    </div>
  );
};

export default Index;
