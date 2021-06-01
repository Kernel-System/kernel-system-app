import './styles.css';
import { http } from 'api';
import { useState } from 'react';
import { Popconfirm, List, Button, Input } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const Index = ({ editItem, onConfirmDelete, onClickItem }) => {
  const fetchItems = async () => {
    const { data } = await http.get('/items/sucursales');
    return data.data;
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filtrarProveedoresPorRFC(data, value);
  };

  const filtrarProveedoresPorRFC = async (sucursales, value) => {
    if (sucursales)
      setListToShow(
        sucursales.filter((item) => item.clave.includes(value.toUpperCase()))
      );
  };

  const [searchValue, setSearchValue] = useState('');

  const { data } = useQuery('sucursales', async () => {
    const result = await fetchItems();
    setListToShow(result);
    filtrarProveedoresPorRFC(result, searchValue);
    return result;
  });
  const [listToShow, setListToShow] = useState([]);

  return (
    <>
      <Input.Search
        onChange={onSearchChange}
        placeholder='Buscar por RFC'
        value={searchValue}
      ></Input.Search>
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
        renderItem={(item) => {
          return (
            <List.Item
              key={item.clave}
              actions={[
                <Link to={`/admid/sucursal/${item.clave}`}>
                  <Button icon={<EditFilled />}></Button>
                </Link>,
                item.almacenes.length === 0 ? (
                  <Popconfirm
                    placement='left'
                    title='¿Está seguro de querer borrar este registro?'
                    okText='Sí'
                    cancelText='No'
                    onConfirm={() => onConfirmDelete(item)}
                  >
                    <Button danger icon={<DeleteFilled />}></Button>
                  </Popconfirm>
                ) : null,
              ]}
            >
              <List.Item.Meta
                title={
                  <p
                    onClick={() => {
                      console.log(item);
                      onClickItem(item);
                    }}
                    style={{
                      cursor: 'pointer',
                      margin: 0,
                    }}
                  >
                    {item.clave}
                  </p>
                }
                description={item.rfc}
              />
              {item.nombre}
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default Index;