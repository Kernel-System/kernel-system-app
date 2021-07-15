import { EyeFilled } from '@ant-design/icons';
import { Button, Col, List, Row, Typography, Select, Badge } from 'antd';
import { http } from 'api';
import { useStoreState } from 'easy-peasy';
import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { WarningTwoTone } from '@ant-design/icons';
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
            <Badge.Ribbon
              color={item.productos_venta.map((producto, indx) => {
                if (producto.cantidad !== producto.cantidad_entregada) {
                  return 'red';
                } else if (indx === item.productos_venta.length - 1) {
                  return 'blue';
                }
              })}
              style={{
                top: -12,
              }}
              text={item.productos_venta.map((producto, indx) => {
                if (producto.cantidad !== producto.cantidad_entregada) {
                  return (
                    <b key={indx}>
                      <WarningTwoTone twoToneColor='orange' /> Falta entrega de
                      producto
                      <WarningTwoTone twoToneColor='orange' />
                    </b>
                  );
                } else if (indx === item.productos_venta.length - 1) {
                  return <b key={indx}>{'Producto entregado correctamente'}</b>;
                }
              })}
            >
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
                      {`No. Venta ${item.no_venta} - Movimiento(s): ${
                        item?.movimientos_almacen?.length !== 0
                          ? `${item.movimientos_almacen
                              .map((dato) => dato.id)
                              .toString()}`
                          : 'Sin movimiento'
                      }`}
                    </p>
                  }
                  description={`Fecha de venta: ${item.fecha_venta}`}
                />
                {
                  <span
                    style={{
                      display: 'inline',
                      opacity: 0.8,
                    }}
                  >
                    <b>{`TOTAL: $${item.total}`}</b>
                  </span>
                }
              </List.Item>
            </Badge.Ribbon>
          );
        }}
      />
    </>
  );
};

export default Index;
