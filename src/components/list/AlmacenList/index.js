import './styles.css';
import { http } from 'api';
import { useState } from 'react';
import { Popconfirm, List, Button, Input } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const Index = ({ onConfirmDelete, onClickItem, putToken }) => {
  const fetchItems = async () => {
    const { data } = await http.get('/items/almacenes', putToken);
    return data.data;
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filtrarAlmacenesPorClave(data, value);
  };

  const filtrarAlmacenesPorClave = async (almacenes, value) => {
    console.log(almacenes);
    if (almacenes)
      setListToShow(
        almacenes.filter((item) => item.clave_sucursal.includes(value))
      );
  };

  const [searchValue, setSearchValue] = useState('');

  const { data } = useQuery('almacenes', async () => {
    const result = await fetchItems();
    setListToShow(result);
    filtrarAlmacenesPorClave(result, searchValue);
    return result;
  });
  const [listToShow, setListToShow] = useState([]);

  return (
    <>
      <Input.Search
        onChange={onSearchChange}
        placeholder='Buscar por Sucursal'
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
                <Link to={`/admin/almacen/${item.clave}`}>
                  <Button icon={<EditFilled />}></Button>
                </Link>,
                item.inventario.length === 0 ? (
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
                    {`Almacen No. ${item.clave}`}
                  </p>
                }
                description={`Encargado: ${item.rfc_encargado}`}
              />
              {`Sucursal: ${item.clave_sucursal}`}
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default Index;
