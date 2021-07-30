import './styles.css';
import { useState } from 'react';
import { Typography, Select, Row, Col } from 'antd';
import { useQuery } from 'react-query';
import { getItems } from 'api/compras/productos_comprados';
import SortSelect, { sortData } from 'components/shared/SortSelect';
import Header from 'components/UI/Heading';
import ProductosCompradosData from './ProductosCompradosData';
import { useStoreState } from 'easy-peasy';

const { Text } = Typography;
const { Option } = Select;

const ProductosCompradosList = ({ editItem, onClickItem, refreshItem }) => {
  const [rfcSearch, setRfcSearch] = useState(undefined);
  const [nombreSearch, setNombreSearch] = useState(undefined);
  const [pendiente, setPendiente] = useState('falta-ingresar');
  const [codigoFilter, setCodigoFilter] = useState('todos');
  const [compraSort, setCompraSort] = useState('recent');

  const [proveedores, setProveedores] = useState([]);
  const [listToShow, setListToShow] = useState([]);

  function onChangeProveedor(value) {
    setRfcSearch(value);
  }

  function onSearchProveedor(value) {
    setNombreSearch(value);
  }

  function handleSort(value) {
    setCompraSort(value);
    setListToShow(sortData(listToShow, value, 'fecha_compra'));
  }

  function onChangePendiente(value) {
    setPendiente(value);
  }

  function onChangeCodigoFilter(value) {
    setCodigoFilter(value);
  }

  const token = useStoreState((state) => state.user.token.access_token);

  useQuery(
    'productos_comprados',
    async () => {
      const { data: fetchedData } = await getItems(token);
      const data = fetchedData.data;
      const productos_comprados = [];
      const newProveedores = [];
      data.forEach(({ no_compra, ...elem }) => {
        const { rfc_emisor, nombre_emisor } = no_compra.factura;
        productos_comprados.push({
          rfc_emisor,
          nombre_emisor,
          fecha_compra: no_compra.fecha_compra,
          fecha_entrega: no_compra.fecha_entrega,
          no_guia: no_compra.no_guia,
          ...elem,
        });
        if (!newProveedores.some((prov) => prov.rfc_emisor === rfc_emisor))
          newProveedores.push({ rfc_emisor, nombre_emisor });
      });
      const sortedData = sortData(
        productos_comprados,
        compraSort,
        'fecha_compra'
      );
      setListToShow(sortedData);
      setProveedores(newProveedores);

      return sortedData;
    },
    {
      onSettled: (data) => {
        refreshItem(data); // can't change of place!
      },
      notifyOnChangeProps: ['error'],
    }
  );

  return (
    <>
      <Header title='Productos comprados' />
      <Row gutter={[10, 12]} style={{ marginBottom: 10 }}>
        <Col xs={24} sm={7} md={5} lg={4} xl={4} xxl={3}>
          <Text
            style={{
              verticalAlign: 'sub',
            }}
          >
            Filtrar por proveedor:
          </Text>
        </Col>
        <Col xs={24} sm={17} md={19} lg={11} xl={11} xxl={12}>
          <Select
            allowClear
            value={rfcSearch}
            showSearch
            style={{ width: '100%' }}
            placeholder='Buscar por proveedor'
            autoClearSearchValue={false}
            onSearch={onSearchProveedor}
            onChange={onChangeProveedor}
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
        <Col xs={24} sm={7} md={5} lg={4} xl={4} xxl={3}>
          <Text
            style={{
              verticalAlign: 'sub',
            }}
          >
            Ordenar por compra:
          </Text>
        </Col>
        <Col xs={24} sm={17} md={19} lg={5} xl={5} xxl={6}>
          <SortSelect
            style={{ width: '100%' }}
            onChange={handleSort}
            value={compraSort}
            recentText='Más reciente'
            oldestText='Más antigua'
          />
        </Col>
      </Row>
      <Row gutter={[10, 12]}>
        <Col xs={24} sm={7} md={5} lg={4} xl={4} xxl={3}>
          <Text
            style={{
              verticalAlign: 'sub',
            }}
          >
            Filtrar pendientes:
          </Text>
        </Col>
        <Col xs={24} sm={17} md={19} lg={11} xl={11} xxl={12}>
          <Select
            value={pendiente}
            onChange={onChangePendiente}
            style={{ width: '100%' }}
            placeholder='Filtrar pendientes'
          >
            <Option value={'todos'}>Todos</Option>
            <Option value={'falta-ingresar'}>Pendientes de ingresar</Option>
            <Option value={'entregado'}>Sin cantidad pendiente</Option>
          </Select>
        </Col>
        <Col xs={24} sm={7} md={5} lg={4} xl={4} xxl={3}>
          <Text
            style={{
              verticalAlign: 'sub',
            }}
          >
            Filtrar por código:
          </Text>
        </Col>
        <Col xs={24} sm={17} md={19} lg={5} xl={5} xxl={6}>
          <Select
            value={codigoFilter}
            onChange={onChangeCodigoFilter}
            style={{ width: '100%' }}
            placeholder='Filtrar por código'
          >
            <Option value={'todos'}>Todos</Option>
            <Option value={'con-codigo'}>Código asignado</Option>
            <Option value={'sin-codigo'}>Sin código asignado</Option>
          </Select>
        </Col>
      </Row>

      <br />
      <ProductosCompradosData
        onClickItem={onClickItem}
        editItem={editItem}
        data={listToShow}
        rfcSearch={rfcSearch}
        nombreSearch={nombreSearch}
        pendienteSearch={pendiente}
        codigoSearch={codigoFilter}
      />
    </>
  );
};

export default ProductosCompradosList;
