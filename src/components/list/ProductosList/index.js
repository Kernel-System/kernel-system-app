import './styles.css';
import { http } from 'api';
import { useState } from 'react';
import { Popconfirm, List, Button, Input, Space } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

const Index = () => {
  const fetchProducts = async () => {
    const { data } = await http.get('/items/productos');
    return data.data;
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filtrarProductosPorNombre(data, value);
  };

  const filtrarProductosPorNombre = async (productos, value) => {
    if (productos)
      setListToShow(productos.filter((item) => item.titulo.includes(value)));
  };

  const [searchValue, setSearchValue] = useState('');

  const { data } = useQuery('productos', async () => {
    const result = await fetchProducts();
    setListToShow(result);
    filtrarProductosPorNombre(result, searchValue);
    return result;
  });
  const [listToShow, setListToShow] = useState([]);

  return (
    <>
      <Input.Search
        onChange={onSearchChange}
        placeholder='Buscar por nombre'
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
        renderItem={(item) => (
          <List.Item
            key={item.codigo}
            actions={[
              <Space>
                <Link to={`/productos/editar/${item.codigo}`}>
                  <Button icon={<EditFilled />} />
                </Link>
                <Popconfirm
                  placement='left'
                  title='¿Está seguro de querer borrar este registro?'
                  okText='Sí'
                  cancelText='No'
                  //onConfirm={() => onConfirmDelete(item)}
                >
                  <Button danger icon={<DeleteFilled />} />
                </Popconfirm>
              </Space>,
            ]}
          >
            <List.Item.Meta
              title={
                <Link to={`/productos/mostrar/${item.codigo}`}>
                  <p
                    style={{
                      cursor: 'pointer',
                      margin: 0,
                    }}
                  >
                    {item.codigo}
                  </p>
                </Link>
              }
              description={item.titulo}
            >
              {item.description}
            </List.Item.Meta>
          </List.Item>
        )}
      />
    </>
  );
};

export default Index;
