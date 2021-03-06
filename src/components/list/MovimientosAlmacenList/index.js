import './styles.css';
import { useState } from 'react';
import { http } from 'api';
import { List, Select, Typography, Button, Grid } from 'antd';
import { useQuery } from 'react-query';
import { conceptosMovimientos } from 'utils/almacen';
import { EyeFilled } from '@ant-design/icons';
import { useStoreState } from 'easy-peasy';
import { pairOfFiltersHeader } from 'utils/gridUtils';
import SortSelect, { sortData } from 'components/shared/SortSelect';
import moment from 'moment';

const { useBreakpoint } = Grid;
const { Option } = Select;
const { Text } = Typography;
const formatoFecha = 'DD MMMM YYYY, h:mm:ss a';

const Index = ({ onClickItem, seeItem }) => {
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const getItems = async (sort) => {
    const { data } = await http.get(
      '/items/movimientos_almacen?fields=*, clave_almacen.clave, clave_almacen.clave_sucursal, productos_movimiento.*,productos_movimiento.series_producto_movimiento.*, rfc_empleado.rfc,rfc_empleado.nombre' +
        `&sort[]=${sort === 'recent' ? '-' : '+'}fecha`,
      putToken
    );
    return data.data;
  };

  const onSearchChange = (e) => {
    const value = e;
    const filteredData = filtrarMovimientoPorConcepto(data, value);
    const sortedData = sortData(filteredData, sortValue);
    setSearchValue(value);
    setListToShow(sortedData);
  };

  function handleSort(value) {
    setSortValue(value);
    setListToShow(sortData(listToShow, value));
  }

  const filtrarMovimientoPorConcepto = (movimientos, value) => {
    if (value === 'Todo') {
      return movimientos?.slice();
    } else if (movimientos)
      return movimientos.filter((item) => item.concepto.includes(value));
  };

  const [sortValue, setSortValue] = useState('recent');
  const [searchValue, setSearchValue] = useState('');
  const [listToShow, setListToShow] = useState([]);

  const { data } = useQuery('movimientos_almacen', async () => {
    const result = await getItems(sortValue);
    const filteredresult = filtrarMovimientoPorConcepto(result, searchValue);
    setListToShow(filteredresult);
    return result;
  });

  const screen = useBreakpoint();

  const fields = [
    <Text
      style={{
        verticalAlign: 'sub',
      }}
    >
      Filtrar por Concepto:
    </Text>,
    <Select
      style={{ width: '100%' }}
      placeholder='Seleccionar un Puesto'
      optionFilterProp='children'
      defaultValue='Todo'
      onChange={onSearchChange}
      filterOption={(input, option) => {
        return option.children.toLowerCase().includes(input.toLowerCase());
      }}
    >
      <Option value='Todo'>Todo</Option>
      {Object.keys(conceptosMovimientos).map((concepto, indx) => (
        <Option key={indx} value={concepto}>
          {concepto}
        </Option>
      ))}
    </Select>,
    <Text
      style={{
        verticalAlign: 'sub',
      }}
    >
      Ordenar por:
    </Text>,
    <SortSelect
      onChange={handleSort}
      value={sortValue}
      recentText='M??s reciente'
      oldestText='M??s antiguo'
    />,
  ];

  return (
    <>
      {pairOfFiltersHeader(screen, fields)}
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
        renderItem={({ concepto, ...item }) => (
          <List.Item
            key={item.id}
            actions={[
              <Button
                icon={<EyeFilled />}
                onClick={() => seeItem({ concepto, ...item })}
              ></Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <p
                  onClick={() => {
                    onClickItem({ concepto, ...item });
                  }}
                  style={{
                    cursor: 'pointer',
                    margin: 0,
                  }}
                >
                  {concepto.startsWith('Entrada') ||
                  concepto.startsWith('Salida')
                    ? concepto
                    : conceptosMovimientos[concepto] + ' - ' + concepto}
                </p>
              }
              description={moment(new Date(item.fecha)).format(formatoFecha)}
            />
            {
              <span
                style={{
                  display: 'inline',
                  opacity: 0.8,
                }}
              >
                Encargado: <b>{item.rfc_empleado.nombre}</b>
              </span>
            }
          </List.Item>
        )}
      />
    </>
  );
};

export default Index;
