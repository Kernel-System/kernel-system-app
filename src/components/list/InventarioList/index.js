import './styles.css';
import { EyeFilled } from '@ant-design/icons';
import { Button, Col, List, Row, Select, Typography, Grid } from 'antd';
import { useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { getItems } from 'api/almacen/inventario';
import { contentCol } from 'utils/gridUtils';

const { useBreakpoint } = Grid;
const { Option } = Select;
const { Text } = Typography;

const Index = ({ onClickItem }) => {
  const [almacenes, setAlmacenes] = useState([]);
  const [searchValue, setSearchValue] = useState('Todo');
  const [listToShow, setListToShow] = useState([]);
  const token = useStoreState((state) => state.user.token.access_token);

  const { data: list } = useQuery('inventario', async () => {
    const { data } = await getItems(token);
    const datos = data.data;
    const newAlmacenes = [];
    datos.forEach(({ clave_almacen }) => {
      if (!newAlmacenes.some((alm) => alm.clave === clave_almacen?.clave))
        newAlmacenes.push({ ...clave_almacen });
    });
    const filteredresult = filtrarPorAlmacen(datos, searchValue);
    onSetInventarios(filteredresult);
    setAlmacenes(newAlmacenes);
    return datos;
  });

  const onSearchChange = (value) => {
    setSearchValue(value);
    const filteredresult = filtrarPorAlmacen(list, value);
    onSetInventarios(filteredresult);
  };

  const filtrarPorAlmacen = (inventario, clave) => {
    if (clave === 'Todo') return inventario?.slice();
    else
      return inventario?.filter((item) => item.clave_almacen?.clave === clave);
  };

  const onSetInventarios = (inventario) => {
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
    setListToShow(newProductos);
  };

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
            Filtrar por Almac??n:
          </Text>
        </Col>
        <Col {...contentCol(screen, 'auto')}>
          <Select
            style={{ width: '100%' }}
            placeholder='Filtrar por Almac??n'
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
                    {item[0].codigo_producto.codigo +
                      ' - ' +
                      item[0].codigo_producto.titulo}
                  </p>
                }
                description={
                  searchValue !== 'Todo'
                    ? `Almac??n: ${item[0].clave_almacen?.clave}`
                    : `Almacenes: ${item
                        .map((inv) => inv.clave_almacen?.clave)
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
