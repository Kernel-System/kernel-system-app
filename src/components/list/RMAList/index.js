import { useState } from 'react';
import Header from 'components/UI/Heading';
import { Popconfirm, List, Typography, Button, Badge, Select } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Grid } from 'antd';
import { useQuery } from 'react-query';
import { getItems } from 'api/compras/rmas';
import { pairOfFiltersHeader } from 'utils/gridUtils';
import SortSelect, { sortData } from 'components/shared/SortSelect';
import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';
import { useStoreState } from 'easy-peasy';

const { useBreakpoint } = Grid;
const formatoFecha = 'DD MMMM YYYY, hh:mm:ss a';

const { Text } = Typography;
const { Option } = Select;

const RMAList = ({ editItem, onConfirmDelete, onClickItem }) => {
  const [searchValue, setSearchValue] = useState(undefined);

  function filtrarPorProveedor(datos, rfc) {
    if (datos && rfc) {
      return datos.filter((item) => item.rfc === rfc);
    } else return datos?.slice();
  }

  function onChange(value) {
    const filteredData = filtrarPorProveedor(list, value);
    const sortedData = sortData(filteredData, rmaSort);
    setSearchValue(value);
    setListToShow(sortedData);
  }

  function onSearch(value) {
    if (list && value) {
      const filteredData = list.filter((item) =>
        item.razon_social.toUpperCase().includes(value.toUpperCase())
      );
      const sortedData = sortData(filteredData, rmaSort);
      setListToShow(sortedData);
    } else if (list) setListToShow(sortData(list, rmaSort));
  }

  function handleSort(value) {
    setRmaSort(value);
    setListToShow(sortData(listToShow, value));
  }

  const token = useStoreState((state) => state.user.token.access_token);

  const { data: list } = useQuery('rmas', async () => {
    const { data } = await getItems(rmaSort, token);
    const datos = data.data;
    const rmas = [];
    const newProveedores = [];
    datos.forEach(({ compra, ...elem }) => {
      const { rfc, razon_social } = compra.proveedor;
      rmas.push({ ...elem, rfc, razon_social, compra: compra.no_compra });
      if (!newProveedores.some((prov) => prov.rfc === rfc))
        newProveedores.push({ rfc, razon_social });
    });
    const filteredresult = filtrarPorProveedor(rmas, searchValue);
    setListToShow(filteredresult);
    setProveedores(newProveedores);
    return rmas;
  });

  const [rmaSort, setRmaSort] = useState('recent');
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
        <Option key={index} value={proveedor.rfc}>
          {proveedor.razon_social}
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
      value={rmaSort}
      recentText='RMA más reciente'
      oldestText='RMA más antiguo'
    />,
  ];

  return (
    <>
      <Header title='RMAs' />
      {pairOfFiltersHeader(screen, fields)}
      {/* <br /> */}
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
              display: 'none',
            }}
          >
            <List.Item
              key={item.id}
              actions={[
                <Button
                  icon={<EditFilled />}
                  onClick={() => editItem(item)}
                ></Button>,
                <Popconfirm
                  placement='left'
                  title='¿Está seguro de querer borrar este registro?'
                  okText='Sí'
                  cancelText='No'
                  onConfirm={() => onConfirmDelete(item)}
                >
                  <Button danger icon={<DeleteFilled />}></Button>
                </Popconfirm>,
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
                    Folio {item.folio} - {item.razon_social}
                  </p>
                }
                description={
                  <p
                    style={{
                      margin: 0,
                    }}
                  >
                    Fecha: {moment(new Date(item.fecha)).format(formatoFecha)}
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
                  {item.estado}
                </h3>
              }
            </List.Item>
          </Badge.Ribbon>
        )}
      />
    </>
  );
};

export default RMAList;
