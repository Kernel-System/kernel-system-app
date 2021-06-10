import './styles.css';
import { useState } from 'react';
import Header from 'components/UI/Heading';
import { Popconfirm, List, Typography, Button, Select } from 'antd';
import { DeleteFilled, EyeFilled } from '@ant-design/icons';
import { Row, Col } from 'antd';
import { useQuery } from 'react-query';
import { getItems } from 'api/shared/facturas_externas';
import {
  tiposDeComprobante,
  usosCfdi,
  tiposRelacion,
} from 'utils/facturas/catalogo';
import moment from 'moment';

const formatoFecha = 'DD MMMM YYYY, h:mm:ss a';

const { Text } = Typography;
const { Option } = Select;

const Index = ({ seeItem, onConfirmDelete, onClickItem }) => {
  const [searchValue, setSearchValue] = useState('');

  function filtrarPorProveedor(facturas, rfc) {
    if (facturas && rfc)
      setListToShow(facturas.filter((item) => item.rfc_emisor === rfc));
    else {
      setListToShow(facturas);
    }
  }

  function onChange(value) {
    setSearchValue(value);
    filtrarPorProveedor(list, value);
  }

  function onSearch(value) {
    if (list && value)
      setListToShow(
        list.filter((item) => item.nombre_emisor.includes(value.toUpperCase()))
      );
    else setListToShow(list);
  }

  function ordenarPorRecientes(lista) {
    return lista.slice().sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }

  function ordenarPorAntiguos(lista) {
    return lista.slice().sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }

  function handleSort(value) {
    switch (value) {
      case 'antigua':
        setListToShow(ordenarPorAntiguos(list));
        break;
      case 'reciente':
        setListToShow(ordenarPorRecientes(list));
        break;
      default:
        break;
    }
  }

  const { data: list } = useQuery('facturas_externas', async () => {
    const { data } = await getItems();
    const datosOrdenados = ordenarPorRecientes(data.data);
    const facturas_externas = [];
    const newProveedores = [];
    datosOrdenados.forEach((factura) => {
      const rfc = factura.rfc_emisor;
      facturas_externas.push(factura);
      if (!newProveedores.some((prov) => prov.rfc === rfc))
        newProveedores.push({
          rfc,
          razon_social: factura.nombre_emisor,
        });
    });
    setListToShow(facturas_externas);
    setProveedores(newProveedores);
    filtrarPorProveedor(facturas_externas, searchValue);
    return facturas_externas;
  });
  const [proveedores, setProveedores] = useState([]);
  const [listToShow, setListToShow] = useState([]);

  return (
    <>
      <Header title='Facturas externas' />
      <Row gutter={[16, 12]}>
        <Col xs={24} lg={12}>
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
              return option.children
                .toLowerCase()
                .includes(input.toLowerCase());
            }}
          >
            {proveedores.map((proveedor, index) => (
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
          <Select
            defaultValue='reciente'
            style={{ width: '100%' }}
            onChange={handleSort}
          >
            <Option value='reciente'>Más reciente</Option>
            <Option value='antigua'>Más antigua</Option>
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
                  {usosCfdi[item.uso_cfdi]} -{' '}
                  {moment(new Date(item.fecha)).format(formatoFecha)}
                </p>
              }
              description={
                <p
                  style={{
                    margin: 0,
                  }}
                >
                  Emisor: {<b>{item.nombre_emisor}</b>}
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
