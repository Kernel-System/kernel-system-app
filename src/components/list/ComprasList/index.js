import './styles.css';
import { useState } from 'react';
import Header from 'components/UI/Heading';
import { Popconfirm, List, Typography, Button, Badge, Select } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Grid } from 'antd';
import { useQuery } from 'react-query';
import { getItems } from 'api/compras';
import { pairOfFiltersHeader } from 'utils/gridUtils';
import SortSelect, { sortData } from 'components/shared/SortSelect';
import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { formatPrice } from 'utils/functions';

const { useBreakpoint } = Grid;
const formatoCompra = 'DD MMMM YYYY, hh:mm:ss a';
const formatoEntrega = 'DD/MM/YYYY';

const { Text } = Typography;
const { Option } = Select;

const Index = ({ editItem, onConfirmDelete, onClickItem }) => {
  const [searchValue, setSearchValue] = useState(undefined);

  function filtrarPorProveedor(compras, rfc) {
    if (compras && rfc) {
      return compras.filter((item) => item.rfc_emisor === rfc);
    } else return compras?.slice();
  }

  function onChange(value) {
    const filteredData = filtrarPorProveedor(list, value);
    const sortedData = sortData(filteredData, compraSort);
    setSearchValue(value);
    setListToShow(sortedData);
  }

  function onSearch(value) {
    if (list && value) {
      const filteredData = list.filter((item) =>
        item.nombre_emisor.toUpperCase().includes(value.toUpperCase())
      );
      const sortedData = sortData(filteredData, compraSort);
      setListToShow(sortedData);
    } else if (list) setListToShow(sortData(list, compraSort));
  }

  function handleSort(value) {
    setCompraSort(value);
    setListToShow(sortData(listToShow, value));
  }

  const { data: list } = useQuery('compras', async () => {
    const { data } = await getItems(compraSort);
    const datos = data.data;
    const compras = [];
    const newProveedores = [];
    datos.forEach(({ factura, ...elem }) => {
      const { rfc_emisor, nombre_emisor } = factura;
      compras.push({ ...factura, ...elem });
      if (!newProveedores.some((prov) => prov.rfc_emisor === rfc_emisor))
        newProveedores.push({ rfc_emisor, nombre_emisor });
    });
    setListToShow(compras);
    setProveedores(newProveedores);
    const filteredresult = filtrarPorProveedor(compras, searchValue);
    setListToShow(filteredresult);
    return compras;
  });

  const [compraSort, setCompraSort] = useState('recent');
  const [proveedores, setProveedores] = useState([]);
  const [listToShow, setListToShow] = useState([]);

  const screen = useBreakpoint();

  const fields = [
    <Text
      style={{
        verticalAlign: 'sub',
      }}
    >
      Buscar por proveedor:
    </Text>,
    <Select
      allowClear
      value={searchValue}
      showSearch
      style={{ width: '100%' }}
      placeholder='Buscar por proveedor'
      autoClearSearchValue={false}
      onSearch={onSearch}
      onChange={onChange}
      filterOption={(input, option) => {
        return option.children.toLowerCase().includes(input.toLowerCase());
      }}
    >
      {proveedores.map((proveedor, index) => (
        <Option key={index} value={proveedor.rfc_emisor}>
          {proveedor.nombre_emisor}
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
      value={compraSort}
      recentText='Compra más reciente'
      oldestText='Compra más antigua'
    />,
  ];

  return (
    <>
      <Header title='Compras' />
      {pairOfFiltersHeader(screen, fields)}
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
        renderItem={(item, index) => (
          <Badge.Ribbon
            locale={locale}
            key={index}
            style={{
              top: -12,
            }}
            text={
              item.fecha_entrega ? (
                <>
                  {'Entrega:'}{' '}
                  <b>{moment(item.fecha_entrega).format(formatoEntrega)}</b>
                </>
              ) : (
                'Sin fecha de entrega'
              )
            }
          >
            <List.Item
              key={item.no_compra}
              actions={[
                <Button
                  icon={<EditFilled />}
                  onClick={() => editItem(item)}
                ></Button>,
                // <Popconfirm
                //   placement='left'
                //   title='¿Está seguro de querer borrar este registro?'
                //   okText='Sí'
                //   cancelText='No'
                //   onConfirm={() => onConfirmDelete(item)}
                //   visible={false}
                // >
                //   <Button  danger icon={<DeleteFilled />}></Button>
                // </Popconfirm>,
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
                    {item.nombre_emisor}
                  </p>
                }
                description={
                  <p
                    style={{
                      margin: 0,
                    }}
                  >
                    Fecha de compra:{' '}
                    {moment(new Date(item.fecha_compra)).format(formatoCompra)}
                  </p>
                }
                key={index}
              />
              {
                <h3
                  style={{
                    display: 'inline',
                  }}
                >
                  TOTAL: {formatPrice(item.total)}
                </h3>
              }
            </List.Item>
          </Badge.Ribbon>
        )}
      />
    </>
  );
};

export default Index;
