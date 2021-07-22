import './styles.css';
import { useState } from 'react';
import { http } from 'api';
import { List, Typography, Row, Col, Button, Input } from 'antd';
import { useQuery } from 'react-query';
import { EyeFilled } from '@ant-design/icons';
import { useStoreState } from 'easy-peasy';
const { Search } = Input;

const { Text } = Typography;

const Index = ({ onClickItem, seeItem }) => {
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const getItems = async () => {
    const { data } = await http.get(
      '/items/info_devoluciones_clientes?fields=*, devolucion_inventario.*,devolucion_inventario.devolucion_inventario_series.*,id_movimiento_almacen.*,id_movimiento_almacen.productos_movimiento.*,id_movimiento_almacen.rfc_empleado.*',
      putToken
    );
    console.log(data.data);
    return data.data;
  };

  const onSearchChange = (e) => {
    const value = e;
    const filteredData = filtrarDevolucionPorDiagnostico(data, value);
    setSearchValue(value);
    setListToShow(filteredData);
  };

  const filtrarDevolucionPorDiagnostico = (movimientos, value) => {
    if (value === '') {
      return movimientos?.slice();
    } else if (movimientos)
      return movimientos.filter((item) => item.diagnostico.includes(value));
  };

  const [searchValue, setSearchValue] = useState('');
  const [listToShow, setListToShow] = useState([]);

  const { data } = useQuery('info_devolucion', async () => {
    const result = await getItems();
    const filteredresult = filtrarDevolucionPorDiagnostico(result, searchValue);
    setListToShow(filteredresult);
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
            Filtrar por Diagnostico:
          </Text>
        </Col>
        <Col xs={24} lg={12}>
          <Search
            placeholder='Buscar por diagnostico'
            allowClear
            enterButton='Buscar'
            onSearch={(value) => {
              onSearchChange(value);
            }}
          />
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
        renderItem={({ ...item }) => (
          <List.Item
            key={item.id}
            actions={[
              <Button
                icon={<EyeFilled />}
                onClick={() => seeItem({ ...item })}
              ></Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <p
                  onClick={() => {
                    onClickItem({ ...item });
                  }}
                  style={{
                    cursor: 'pointer',
                    margin: 0,
                  }}
                >
                  {`No. ${item.id} - ${item.diagnostico}`}
                </p>
              }
              description={`Producto(s): ${item.devolucion_inventario
                .map((devolucion) => devolucion.codigo_producto)
                .toString()}`}
            />
            {
              <span
                style={{
                  display: 'inline',
                  opacity: 0.8,
                }}
              >
                Encargado:{' '}
                <b>{item.id_movimiento_almacen[0].rfc_empleado?.nombre}</b>
              </span>
            }
          </List.Item>
        )}
      />
    </>
  );
};

export default Index;
