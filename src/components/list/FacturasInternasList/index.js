import './styles.css';
import { useState } from 'react';
import { useStoreState } from 'easy-peasy';
import Header from 'components/UI/Heading';
import { Popconfirm, List, Typography, Button, Select } from 'antd';
import { DeleteFilled, EyeFilled } from '@ant-design/icons';
import { Row, Col } from 'antd';
import { useQuery } from 'react-query';
import { getItems } from 'api/shared/facturas_internas';
import {
  tiposDeComprobante,
  usosCfdi,
  tiposRelacion,
} from 'utils/facturas/catalogo';
import SortSelect, { sortData } from 'components/shared/SortSelect';
import moment from 'moment';

const formatoFecha = 'DD MMMM YYYY, h:mm:ss a';

const { Text } = Typography;
const { Option } = Select;

const Index = ({ seeItem, onConfirmDelete, onClickItem }) => {
  const [searchValue, setSearchValue] = useState(null);

  function filtrarPorCliente(facturas, rfc) {
    if (facturas && rfc) {
      return facturas.filter((item) => item.rfc_receptor === rfc);
    } else return facturas?.slice();
  }

  function onChange(value) {
    const filteredData = filtrarPorCliente(list, value);
    const sortedData = sortData(filteredData, sortValue);
    setSearchValue(value);
    setListToShow(sortedData);
  }

  function onSearch(value) {
    if (list && value) {
      const filteredData = list.filter((item) =>
        item.nombre_receptor
          ? item.nombre_receptor.toUpperCase().includes(value.toUpperCase())
          : item.rfc_receptor.toUpperCase().includes(value.toUpperCase())
      );
      const sortedData = sortData(filteredData, sortValue);
      setListToShow(sortedData);
    } else if (list) setListToShow(sortData(list, sortValue));
  }

  function handleSort(value) {
    setSortValue(value);
    setListToShow(sortData(listToShow, value));
  }
  const token = useStoreState((state) => state.user.token.access_token);

  const { data: list } = useQuery('facturas_internas', async () => {
    const { data } = await getItems(sortValue, token);
    const datos = data.data;
    const facturas_internas = [];
    const newClientes = [];
    datos.forEach((factura) => {
      const rfc = factura.rfc_receptor;
      facturas_internas.push(factura);
      if (!newClientes.some((prov) => prov.rfc === rfc)) {
        newClientes.push({
          rfc,
          razon_social: factura.nombre_receptor ?? rfc,
        });
      }
    });
    setListToShow(facturas_internas);
    setClientes(newClientes);
    const filteredresult = filtrarPorCliente(facturas_internas, searchValue);
    setListToShow(filteredresult);
    return facturas_internas;
  });

  const [sortValue, setSortValue] = useState('recent');
  const [clientes, setClientes] = useState([]);
  const [listToShow, setListToShow] = useState([]);

  return (
    <>
      <Header title='Facturas internas' />
      <Row gutter={[16, 12]}>
        <Col xs={24} lg={12}>
          <Select
            allowClear
            value={searchValue}
            showSearch
            style={{ width: '100%' }}
            placeholder='Buscar por cliente'
            autoClearSearchValue={false}
            onSearch={onSearch}
            onChange={onChange}
            filterOption={(input, option) => {
              return option.children
                .toLowerCase()
                .includes(input.toLowerCase());
            }}
          >
            {clientes.map((proveedor, index) => (
              <Option key={index} value={proveedor.rfc}>
                {proveedor.razon_social}
              </Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Text
            style={{
              verticalAlign: 'sub',
            }}
          >
            Ordenar por:
          </Text>
        </Col>
        <Col flex={1} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <SortSelect
            onChange={handleSort}
            value={sortValue}
            recentText='Más reciente'
            oldestText='Más antiguo'
          />
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
        renderItem={(item, index) => (
          <List.Item
            key={item.no_compra}
            actions={[
              <Button
                icon={<EyeFilled />}
                onClick={() => seeItem(item)}
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
                  {item.nombre_receptor ?? item.rfc_receptor}
                </p>
              }
              description={
                <p
                  style={{
                    margin: 0,
                  }}
                >
                  <b>{usosCfdi[item.uso_cfdi]} - </b>
                  {moment(new Date(item.fecha)).format(formatoFecha)}
                </p>
              }
              key={index}
            />
            {
              <b
                style={{
                  display: 'inline',
                  opacity: 0.8,
                }}
              >
                {tiposDeComprobante[item.tipo_de_comprobante]} -{' '}
                {item.tipo_relacion
                  ? tiposRelacion[item.tipo_relacion]
                  : 'Sin CFDIs relacionados'}
              </b>
            }
          </List.Item>
        )}
      />
    </>
  );
};

export default Index;
