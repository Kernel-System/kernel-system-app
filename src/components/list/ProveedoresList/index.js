import './styles.css';
import { useState } from 'react';
import {
  Popconfirm,
  List,
  Button,
  Row,
  Col,
  Select,
  Grid,
  Typography,
} from 'antd';
import { DeleteFilled, EditFilled, WarningTwoTone } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { getItems } from 'api/compras/proveedores';
import { regimenesFiscales } from 'utils/facturas/catalogo';
import { contentCol } from 'utils/gridUtils';

const { Option } = Select;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const Index = ({ editItem, onConfirmDelete, onClickItem }) => {
  const [searchValue, setSearchValue] = useState(null);

  function filtrarPorProveedor(proveedores, rfc) {
    if (proveedores && rfc)
      setListToShow(proveedores.filter((item) => item.rfc === rfc));
    else {
      setListToShow(proveedores);
    }
  }

  function onChange(value) {
    setSearchValue(value);
    filtrarPorProveedor(list, value);
  }

  function onSearch(value) {
    if (list && value)
      setListToShow(
        list.filter((item) => item.razon_social.includes(value.toUpperCase()))
      );
    else setListToShow(list);
  }

  const { data: list } = useQuery('proveedores', async () => {
    const { data } = await getItems();
    const proveedores = data.data;
    setListToShow(proveedores);
    return proveedores;
  });
  const [listToShow, setListToShow] = useState([]);

  const screen = useBreakpoint();

  return (
    <>
      <Row gutter={[10, 12]}>
        <Col>
          <Text
            style={{
              verticalAlign: 'sub',
            }}
          >
            Buscar por proveedor:
          </Text>
        </Col>
        <Col {...contentCol(screen, 'auto')}>
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
            {list
              ? list.map((proveedor, index) => (
                  <Option key={index} value={proveedor.rfc}>
                    {proveedor.razon_social}
                  </Option>
                ))
              : []}
          </Select>
        </Col>
      </Row>
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
          const eliminarDesactivado =
            item.compras?.length || item.ordenes_compra?.length;
          return (
            <List.Item
              key={item.rfc}
              actions={[
                <Button
                  icon={<EditFilled />}
                  onClick={() => editItem(item)}
                ></Button>,
                <Popconfirm
                  {...{
                    icon: eliminarDesactivado ? (
                      <WarningTwoTone twoToneColor='red' />
                    ) : undefined,
                  }}
                  title={
                    eliminarDesactivado
                      ? 'Existen compras u ordenes de compras a este proveedor.'
                      : '¿Está seguro de querer borrar este registro?'
                  }
                  okText={eliminarDesactivado ? 'OK' : 'Sí'}
                  cancelText='Cancelar'
                  cancelButtonProps={{
                    style: {
                      display: eliminarDesactivado ? 'none' : 'initial',
                    },
                  }}
                  onConfirm={() =>
                    eliminarDesactivado ? null : onConfirmDelete(item)
                  }
                >
                  <Button
                    danger
                    icon={<DeleteFilled />}
                    disabled={eliminarDesactivado}
                  ></Button>
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
                    {item.razon_social}
                  </p>
                }
                description={item.rfc}
              />
              <b
                style={{
                  display: 'inline',
                  opacity: 0.8,
                }}
              >
                {regimenesFiscales[item.regimen_fiscal]}
              </b>
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default Index;
