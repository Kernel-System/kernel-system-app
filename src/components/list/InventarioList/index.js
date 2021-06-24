import './styles.css';
import { useState, useEffect } from 'react';
import { http } from 'api';
import { List, Select, Typography, Row, Col, Button } from 'antd';
import { EyeFilled } from '@ant-design/icons';
import { useStoreState } from 'easy-peasy';
const { Option } = Select;
const { Text } = Typography;

const Index = ({ onClickItem }) => {
  const [almacenes, setAlmacenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    http.get('/items/almacenes', putToken).then((result) => {
      onSetAlmacenes(result.data.data);
    });
    http
      .get(
        '/items/inventario?fields=*,codigo_producto.*,series_inventario.*',
        putToken
      )
      .then((result) => {
        onSetInventarios(result.data.data);
      });
  }, []);

  const onSetInventarios = (lista) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    setInventario(newLista);
    onSetProductos(newLista);
  };

  const onSetAlmacenes = (lista) => {
    setAlmacenes(lista);
  };

  const onSearchChange = (value) => {
    setSearchValue(value);
    filtrarAlmacenesPorClaveConProducto(inventario, productos, value);
  };

  const filtrarAlmacenesPorClaveConProducto = async (
    almacenes,
    producto,
    value
  ) => {
    if (value === 'Todo') {
      if (producto.length === 0) setProductos(producto);
      setListToShow(producto);
    } else if (almacenes)
      setListToShow(almacenes.filter((item) => item.clave_almacen === value));
  };

  const [searchValue, setSearchValue] = useState('Todo');

  const onSetProductos = (result) => {
    let juntarProductos = {};
    let arrayProductos = [];
    const newData = JSON.parse(JSON.stringify(result));
    newData.forEach((dato) => {
      const objName = `${dato.codigo_producto.codigo}`;
      if (juntarProductos[objName] === undefined) {
        juntarProductos[objName] = [dato];
      } else {
        juntarProductos[objName] = [...juntarProductos[objName], dato];
      }
    });
    Object.keys(juntarProductos).map((key) => {
      return arrayProductos.push(juntarProductos[key]);
    });
    setProductos(arrayProductos);
    filtrarAlmacenesPorClaveConProducto(newData, arrayProductos, searchValue);
  };

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
            Filtrar por Concepto:
          </Text>
        </Col>
        <Col xs={24} lg={12}>
          <Select
            style={{ width: '100%' }}
            placeholder='Seleccionar un Puesto'
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
            {almacenes.map((almacen, indx) => (
              <Option key={indx} value={almacen.clave}>
                {`${almacen.clave} : ${almacen.clave_sucursal}`}
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
                  onClick={() => onClickItem(item, searchValue)}
                ></Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <p
                    onClick={() => {
                      onClickItem(item, searchValue);
                    }}
                    style={{
                      cursor: 'pointer',
                      margin: 0,
                    }}
                  >
                    {searchValue !== 'Todo'
                      ? `Producto ${item.codigo_producto.titulo}`
                      : `Producto ${item[0].codigo_producto.titulo}`}
                  </p>
                }
                description={
                  searchValue !== 'Todo'
                    ? `Almacen: ${item.clave_almacen}`
                    : `Almacenes: ${item
                        .map((inv) => inv.clave_almacen)
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
                    <b>{`${item.cantidad}`}</b>
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
