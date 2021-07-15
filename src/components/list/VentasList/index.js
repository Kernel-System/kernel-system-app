import './styles.css';
import { EyeFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Col, List, Row, Typography, Select, Grid, Badge } from 'antd';
import { Link } from 'react-router-dom';
import { http } from 'api';
import { useStoreState } from 'easy-peasy';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { contentCol } from 'utils/gridUtils';
import moment from 'moment';

const { Option } = Select;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const formatoFecha = 'DD MMMM YYYY, hh:mm:ss a';

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
      '/items/ventas?fields=*,id_cliente.*,movimientos_almacen.*,movimientos_almacen.productos_movimiento.*,productos_venta.*,rfc_vendedor.*',
      putToken
    );
    return data.data;
  };

  const { data } = useQuery('ventas', async () => {
    const result = await fetchItems();
    setListToShow(result);
    filtrarVentasPorNumeroVenta(result, searchValue);
    return result;
  });

  const onSearchChange = (e) => {
    const value = e;
    setSearchValue(value);
    filtrarVentasPorNumeroVenta(data, value);
  };

  const filtrarVentasPorNumeroVenta = async (ventas, value) => {
    if (value === 'Todo') {
      setListToShow(ventas);
    } else if (ventas)
      setListToShow(
        ventas.filter((item) => item.rfc_vendedor.sucursal === value)
      );
  };

  const [searchValue, setSearchValue] = useState('Todo');
  const [listToShow, setListToShow] = useState([]);

  const screen = useBreakpoint();

  return (
    <>
      <Row gutter={[10, 12]} style={{ marginBottom: 10 }}>
        <Col>
          <Text
            style={{
              verticalAlign: 'sub',
            }}
          >
            Filtrar por Sucursal:
          </Text>
        </Col>
        <Col {...contentCol(screen, 'auto')}>
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
              key={item.no_venta}
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
                    {`Cliente: ${item.no_venta}`}
                  </p>
                }
                description={`Fecha de venta: ${moment(
                  new Date(item.fecha_venta)
                ).format(formatoFecha)}`}
              />
              {
                <span
                  style={{
                    display: 'inline',
                    opacity: 0.8,
                  }}
                >
                  <b>{`Total: $${item.total}`}</b>
                </span>
              }
            </List.Item>
          );
        }}
      />
      <Link to='/venta'>
        <Button type='primary' size='default' icon={<PlusOutlined />}>
          Añadir nueva venta
        </Button>
      </Link>
    </>
  );
};

export default Index;
