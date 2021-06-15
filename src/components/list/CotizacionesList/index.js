import './styles.css';
import { http } from 'api';
import { useState } from 'react';
import { List, Badge, Input } from 'antd';
import { useQuery } from 'react-query';
import { useStoreState } from 'easy-peasy';

const Index = ({ onConfirmDelete, onClickItem }) => {
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const fetchItems = async () => {
    const { data } = await http.get(
      '/items/cotizaciones?fields=*,productos_cotizados.*,rfc_empleado.*',
      putToken
    );
    return data.data;
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filtrarClientePorRFC(data, value);
  };

  const filtrarClientePorRFC = async (clientes, value) => {
    if (value === '') {
      setListToShow(clientes);
    } else if (clientes)
      setListToShow(
        clientes.filter((item) => item.nombre_cliente.includes(value))
      );
  };

  const [searchValue, setSearchValue] = useState('');

  const { data } = useQuery('cotizaciones', async () => {
    const result = await fetchItems();
    setListToShow(result);
    filtrarClientePorRFC(result, searchValue);
    return result;
  });
  const [listToShow, setListToShow] = useState([]);

  return (
    <>
      <Input.Search
        onChange={onSearchChange}
        placeholder='Buscar por nombre de cliente'
        value={searchValue}
      />
      <br />
      <List
        itemLayout='horizontal'
        size='default'
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        dataSource={listToShow}
        renderItem={(item) => {
          return (
            <Badge.Ribbon text={`${item.fecha_creacion}`}>
              <List.Item key={item.folio}>
                <List.Item.Meta
                  title={
                    <p
                      onClick={() => {
                        onClickItem(item);
                      }}
                      style={{
                        cursor: 'pointer',
                        margin: 0,
                      }}
                    >
                      {`Folio : ${item.folio}`}
                    </p>
                  }
                  description={`${item.nombre_cliente}`}
                />
                {`${item.empresa}`}
              </List.Item>
            </Badge.Ribbon>
          );
        }}
      />
    </>
  );
};

export default Index;
