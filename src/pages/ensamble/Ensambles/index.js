import EnsambleList from 'components/list/EnsambleList';
import { Typography, Select } from 'antd';
import { useEffect, useState } from 'react';
import { http } from 'api';
const { Title, Text } = Typography;
const { Option } = Select;

const Index = () => {
  const [pag, setPag] = useState(1);
  const [list, setList] = useState([]);
  const [estado, setEstado] = useState('Ordenado');

  useEffect(() => {
    http
      .get(
        `/items/ordenes_ensamble?offset=${5 * (pag - 1)}&?limit=${
          5 * pag
        }&?fields=folio,fechaorden,estado&?filter={"estado":${'Ingresado en almacén'}}`
      )
      .then((result) => {
        //console.log(result.data)
        ChangeList(result.data.data);
      });
  }, [estado]);

  function handleChange(value) {
    setEstado(value);
  }

  const ChangeList = (lista) => {
    setList(lista);
  };

  const ChangePag = (pagina) => {
    setPag(pag);
  };

  const ensamble = <EnsambleList list={list} changePag={ChangePag} />;

  return (
    <div>
      <Title level={3}>Órdenes de Ensamble</Title>
      <Text>Ordenar por Estado:</Text>
      <br />
      <Select
        defaultValue='Ordenado'
        style={{ width: 120 }}
        onChange={handleChange}
      >
        <Option value='Ordenado'>Ordenado</Option>
        <Option value='En ensamble'>En ensamble</Option>
        <Option value='Ensamblado'>Ensamblado</Option>
        <Option value='Ingresado en almacén'>Ingresado en almacén</Option>
      </Select>
      {ensamble}
    </div>
  );
};

export default Index;
