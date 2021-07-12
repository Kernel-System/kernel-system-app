import { EyeFilled } from '@ant-design/icons';
import { Button, Col, List, Row, Select, Typography } from 'antd';
import { useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { getItems } from 'api/almacen/inventario';

import './styles.css';
const { Option } = Select;
const { Text } = Typography;

const Index = ({ onClickItem }) => {
  const [almacenes, setAlmacenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [searchValue, setSearchValue] = useState('Todo');
  const [listToShow, setListToShow] = useState([]);
  const token = useStoreState((state) => state.user.token.access_token);

  const { data: list } = useQuery('inventario', async () => {
    const { data } = await getItems(token);
    const datos = data.data;
    const newAlmacenes = [];
    datos.forEach(({ clave_almacen }) => {
      if (!newAlmacenes.some((alm) => alm.clave === clave_almacen.clave))
        newAlmacenes.push({ ...clave_almacen });
    });
    const filteredresult = filtrarPorAlmacen(datos, searchValue);
    onSetInventarios(filteredresult);
    setAlmacenes(newAlmacenes);
    return datos;
  });

  const onSetInventarios = (inventarios) => {
    setInventario(inventarios);
    onSetProductos(inventarios);
  };

  const onSearchChange = (value) => {
    setSearchValue(value);
    const filteredresult = filtrarPorAlmacen(list, value);
    onSetInventarios(filteredresult);
  };

  const filtrarPorAlmacen = (inventario, clave) => {
    if (clave === 'Todo') return inventario?.slice();
    else
      return inventario?.filter((item) => item.clave_almacen.clave === clave);
  };

  const onSetProductos = (inventario) => {
    const productosJuntados = {};
    const newProductos = [];
    inventario?.forEach((dato) => {
      const objName = `${dato.codigo_producto.codigo}`;
      if (productosJuntados[objName] === undefined) {
        productosJuntados[objName] = [dato];
      } else {
        productosJuntados[objName] = [...productosJuntados[objName], dato];
      }
    });
    Object.keys(productosJuntados).map((key) => {
      return newProductos.push(productosJuntados[key]);
    });
    setProductos(newProductos);
    setListToShow(newProductos);
  };

  return (
    <>
      <Row gutter={[16, 12]}>
        <Col xs={24} lg={4}>
          <Text
            style={{
              verticalAlign: 'sub',
            }}
          >
            Filtrar por Almacén:
          </Text>
        </Col>
        <Col xs={24} lg={20}>
          <Select
            style={{ width: '100%' }}
            placeholder='Filtrar por Almacén'
            optionFilterProp='children'
            defaultValue='Todo'
            onChange={onSearchChange}
            filterOption={(input, option) => {
              return option.children
                .toLowerCase()
                .includes(input.toLowerCase());
            }}
          >
            <Option value='Todo'>Todos</Option>
            {almacenes.map((almacen) => (
              <Option value={almacen.clave} key={almacen.clave}>
                <b
                  style={{
                    opacity: 0.6,
                  }}
                >
                  {almacen.clave}
                </b>
                : de sucursal{' '}
                <b
                  style={{
                    opacity: 0.6,
                  }}
                >
                  {almacen.clave_sucursal}
                </b>
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
              key={searchValue !== 'Todo' ? item.id : item[0].id}
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
                    {item[0].codigo_producto.titulo}
                  </p>
                }
                description={
                  searchValue !== 'Todo'
                    ? `Almacén: ${item[0].clave_almacen.clave}`
                    : `Almacenes: ${item
                        .map((inv) => inv.clave_almacen.clave)
                        .toString()}`
                }
              />
              {
                <span
                  style={{
                    display: 'inline',
                    opacity: 0.8,
                  }}
                >
                  Cantidad:{' '}
                  {searchValue !== 'Todo' ? (
                    <b>{`${item[0].cantidad}`}</b>
                  ) : (
                    <b>{`${item
                      .map((dato) => dato.cantidad)
                      .reduce((a, b) => a + b, 0)}`}</b>
                  )}
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
