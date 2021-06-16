import './styles.css';
import { useState } from 'react';
import { Popconfirm, List, Button, Select } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { getItems } from 'api/compras/proveedores';
import { regimenesFiscales } from 'utils/facturas/catalogo';
const { Option } = Select;

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

  return (
    <>
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
        {list
          ? list.map((proveedor, index) => (
              <Option key={index} value={proveedor.rfc}>
                {proveedor.razon_social}
              </Option>
            ))
          : []}
      </Select>
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
        renderItem={(item) => (
          <List.Item
            key={item.rfc}
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
        )}
      />
    </>
  );
};

export default Index;
