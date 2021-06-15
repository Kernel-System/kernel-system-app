import './styles.css';
import { http } from 'api';
import { useState } from 'react';
import { List, Badge, Select, Typography } from 'antd';
import { useQuery } from 'react-query';
import { useStoreState } from 'easy-peasy';
const { Option } = Select;
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
      '/items/movimientos_almacen?fields=*,productos_movimiento.*,productos_movimiento.series_producto_movimiento.*',
      putToken
    );
    return data.data;
  };

  const onSearchChange = (e) => {
    const value = e;
    setSearchValue(value);
    filtrarMovimientoPorConcepto(data, value);
  };

  const filtrarMovimientoPorConcepto = async (movimientos, value) => {
    if (value === 'Todo') {
      setListToShow(movimientos);
    } else if (movimientos)
      setListToShow(
        movimientos.filter((item) => item.concepto.includes(value))
      );
  };

  const [searchValue, setSearchValue] = useState('');

  const { data } = useQuery('movimientos_almacen', async () => {
    const result = await fetchItems();
    setListToShow(result);
    filtrarMovimientoPorConcepto(result, searchValue);
    return result;
  });
  const [listToShow, setListToShow] = useState([]);

  return (
    <>
      <Text>Filtrar por Concepto:</Text>
      <br />
      <Select
        style={{ width: '40%' }}
        placeholder='Seleccionar un Puesto'
        optionFilterProp='children'
        defaultValue='Todo'
        onChange={onSearchChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value='Todo'>Todo</Option>
        <Option value='Compra'>Compra</Option>
        <Option value='Venta'>Venta</Option>
        <Option value='Devolución a cliente'>Devolución a cliente</Option>
        <Option value='Regreso de mercancía'>Regreso de mercancía</Option>
        <Option value='Entrada por transferencia'>
          Entrada por transferencia
        </Option>
        <Option value='Salida por transferencia'>
          Salida por transferencia
        </Option>
        <Option value='Componentes de ensamble'>Componentes de ensamble</Option>
        <Option value='Producto ensamblado'>Producto ensamblado</Option>
      </Select>
      <List
        itemLayout='vertical'
        size='default'
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        dataSource={listToShow}
        renderItem={(item) => (
          <Badge.Ribbon text={item.concepto}>
            <List.Item
              key={item.clave}
              onClick={() => {
                onClickItem(item);
              }}
            >
              <List.Item.Meta
                //avatar={<Avatar src={item.avatar} />}
                title={`Movimiento No. ${item.id}`}
                description={item.fecha}
              />
              {`Almacen: ${item.clave_almacen}`}
            </List.Item>
          </Badge.Ribbon>
        )}
      />
    </>
  );
};

export default Index;
