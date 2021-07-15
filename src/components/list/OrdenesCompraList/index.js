import './styles.css';
import { http } from 'api';
import { useState } from 'react';
import { List, Select, Button, Row, Col, Typography } from 'antd';
import { EyeFilled } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { useStoreState } from 'easy-peasy';
import SortSelect, { sortData } from 'components/shared/SortSelect';
const { Text } = Typography;
const { Option } = Select;

const Index = ({ onClickItem }) => {
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const fetchItems = async () => {
    const { data } = await http.get(
      '/items/ordenes_compra?fields=*,productos_ordenes_compra.*,rfc_proveedor.*,rfc_empleado.*',
      putToken
    );
    console.log(data.data);
    return data.data;
  };

  const fetchProveedores = async () => {
    const { data } = await http.get(`/items/proveedores?fields=*`, putToken);
    return data.data;
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filtrarOrdenPorRFC(data, value);
  };

  const filtrarOrdenPorRFC = async (ordenes, value) => {
    if (value === 'Todos') {
      setListToShow(ordenes);
    } else if (ordenes)
      setListToShow(
        ordenes.filter((item) => item.rfc_proveedor.rfc.includes(value))
      );
  };

  const [sortValue, setSortValue] = useState('recent');
  const [searchValue, setSearchValue] = useState('Todos');
  const [listToShow, setListToShow] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  function handleSort(value) {
    setSortValue(value);
    setListToShow(sortData(listToShow, value));
  }

  const { data } = useQuery('ordenes_compra', async () => {
    const result = await fetchItems();
    setListToShow(result);
    filtrarOrdenPorRFC(result, searchValue);
    return result;
  });

  useQuery('proveedores', async () => {
    const result = await fetchProveedores();
    setProveedores(result);
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
            Filtrar por RFC:
          </Text>
        </Col>
        <Col xs={24} lg={12}>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Proveedor'
            optionFilterProp='children'
            onChange={(value, index) => {
              onSearchChange(value, index);
            }}
            defaultValue='Todos'
          >
            <Option key={'Todos'} value={'Todos'}>
              {'Todos'}
            </Option>
            {proveedores.map((proveedor) => (
              <Option key={proveedor.rfc} value={proveedor.rfc}>
                {`${proveedor.rfc} : ${proveedor.razon_social}`}
              </Option>
            ))}
          </Select>
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
                description={`Proveedor: ${item.rfc_proveedor.rfc}`}
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
