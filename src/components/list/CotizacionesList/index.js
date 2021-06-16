import './styles.css';
import { http } from 'api';
import { useState } from 'react';
import { List, Input, Button, Row, Col, Typography } from 'antd';
import { EyeFilled } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { useStoreState } from 'easy-peasy';
import SortSelect, { sortData } from 'components/shared/SortSelect';
const { Text } = Typography;

const Index = ({ onClickItem }) => {
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

  const [sortValue, setSortValue] = useState('recent');
  const [searchValue, setSearchValue] = useState('');
  const [listToShow, setListToShow] = useState([]);

  function handleSort(value) {
    setSortValue(value);
    setListToShow(sortData(listToShow, value));
  }

  const { data } = useQuery('cotizaciones', async () => {
    const result = await fetchItems();
    setListToShow(result);
    filtrarClientePorRFC(result, searchValue);
    return result;
  });

  return (
    <>
      <Row gutter={[16, 12]}>
        <Col>
          <Text
            style={{
              verticalAlign: 'sub',
            }}
          >
            Filtrar por Nombre:
          </Text>
        </Col>
        <Col xs={24} lg={12}>
          <Input.Search
            onChange={onSearchChange}
            placeholder='Buscar por nombre de cliente'
            value={searchValue}
          />
        </Col>
        <Col>
          <Text
            style={{
              verticalAlign: 'sub',
            }}
          >
            Ordenar por:
          </Text>
        </Col>
        <Col flex={1} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <SortSelect
            onChange={handleSort}
            value={sortValue}
            recentText='Más reciente'
            oldestText='Más antiguo'
          />
        </Col>
      </Row>
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
            <List.Item
              key={item.folio}
              actions={[
                <Button
                  icon={<EyeFilled />}
                  onClick={() => onClickItem(item)}
                ></Button>,
              ]}
            >
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
                description={`${item.nombre_cliente} - ${item.empresa}`}
              />
              {
                <span
                  style={{
                    display: 'inline',
                    opacity: 0.8,
                  }}
                >
                  Fecha: <b>{item.fecha_creacion}</b>
                </span>
              }
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default Index;
