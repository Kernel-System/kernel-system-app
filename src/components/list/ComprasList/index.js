import './styles.css';
import { useState } from 'react';
import Header from 'components/UI/Heading';
import { Popconfirm, List, Typography, Button, Badge, Select } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Row, Col } from 'antd';
import { useQuery } from 'react-query';
import { getItems } from 'api/shared/compras';
import moment from 'moment';
import 'moment/locale/es-mx';
import locale from 'antd/es/date-picker/locale/es_ES';

const formatoCompra = 'DD MMMM YYYY, h:mm:ss a';
const formatoEntrega = 'DD/MM/YYYY';

const { Text } = Typography;
const { Option } = Select;

const Index = ({ editItem, onConfirmDelete, onClickItem }) => {
  const [searchValue, setSearchValue] = useState('');

  function filtrarPorProveedor(compras, rfc) {
    if (compras && rfc)
      setListToShow(compras.filter((item) => item.rfc_emisor === rfc));
    else {
      setListToShow(compras);
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
    return lista
      .slice()
      .sort((a, b) => new Date(b.fecha_compra) - new Date(a.fecha_compra));
  }

  function ordenarPorAntiguos(lista) {
    return lista
      .slice()
      .sort((a, b) => new Date(a.fecha_compra) - new Date(b.fecha_compra));
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

  const { data: list } = useQuery('compras', async () => {
    const { data } = await getItems();
    const datosOrdenados = ordenarPorRecientes(data.data);
    const compras = [];
    const newProveedores = [];
    datosOrdenados.forEach(({ factura, ...elem }) => {
      const { rfc_emisor, nombre_emisor } = factura;
      compras.push({ ...factura, ...elem });
      if (!newProveedores.some((prov) => prov.rfc_emisor === rfc_emisor))
        newProveedores.push({ rfc_emisor, nombre_emisor });
    });
    setListToShow(compras);
    setProveedores(newProveedores);
    filtrarPorProveedor(compras, searchValue);
    return compras;
  });
  const [proveedores, setProveedores] = useState([]);
  const [listToShow, setListToShow] = useState([]);

  return (
    <>
      <Header title='Compras' />
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
              <Option key={index} value={proveedor.rfc_emisor}>
                {proveedor.nombre_emisor}
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
                  TOTAL: ${item.total}
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
