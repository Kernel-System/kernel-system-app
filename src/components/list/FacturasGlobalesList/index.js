import { EyeFilled } from '@ant-design/icons';
import { Button, Col, List, Row, Typography, Select } from 'antd';
import { http } from 'api';
import { useStoreState } from 'easy-peasy';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import './styles.css';
const { Option } = Select;
const { Text } = Typography;

const Index = ({ onClickItem }) => {
  const [sucursales, setSucursales] = useState([]);
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    http
      .get('/items/sucursales?fields=clave,nombre', putToken)
      .then((result) => {
        onSetSucursales(result.data.data);
      });
  }, []);

  const onSetSucursales = (lista) => {
    setSucursales(lista);
  };

  const fetchItems = async () => {
    const { data } = await http.get(
      '/items/facturas_globales?fields=*,factura.*,factura.ventas_globales.*',
      putToken
    );
    console.log(data.data);
    return data.data;
  };

  const { data } = useQuery('facturas_globales', async () => {
    const result = await fetchItems();
    setListToShow(result);
    filtrarVentasPorSucursal(result, searchValue);
    return result;
  });

  const onSearchChange = (e) => {
    const value = e;
    setSearchValue(value);
    filtrarVentasPorSucursal(data, value);
  };

  const filtrarVentasPorSucursal = async (fac_global, value) => {
    if (value === 'Todo') {
      setListToShow(fac_global);
    } else if (fac_global)
      setListToShow(fac_global.filter((item) => item.sucursal === value));
  };

  const [searchValue, setSearchValue] = useState('Todo');
  const [listToShow, setListToShow] = useState([]);

  //
  return (
    <>
      <Row gutter={[16, 12]}>
        <Col>
          <Text
            style={{
              verticalAlign: 'sub',
            }}
          >
            Filtrar por Sucursal:
          </Text>
        </Col>
        <Col xs={24} lg={12}>
          <Select
            style={{ width: '100%' }}
            placeholder='Seleccionar una Sucursal'
            optionFilterProp='children'
            defaultValue='Todo'
            onChange={onSearchChange}
            filterOption={(input, option) => {
              return option.children
                .toLowerCase()
                .includes(input.toLowerCase());
            }}
          >
            <Option value='Todo'>Todo</Option>
            {sucursales.map((almacen, indx) => (
              <Option key={indx} value={almacen.clave}>
                {`${almacen.clave} : ${almacen.nombre}`}
              </Option>
            ))}
          </Select>
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
              key={item.id}
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
                    {`No. Fac. Global ${item.id}`}
                  </p>
                }
                description={`Fecha: ${item.fecha}`}
              />
              {
                <span
                  style={{
                    display: 'inline',
                    opacity: 0.8,
                  }}
                >
                  Sucursal: {<b>{`${item.sucursal}`}</b>}
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
