import './styles.css';
import { http } from 'api';
import { useState } from 'react';
import { Popconfirm, List, Button, Input, Select } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
const { Option } = Select;

const Index = ({ onConfirmDelete, onClickItem }) => {
  const fetchItems = async () => {
    const { data } = await http.get(
      '/items/clientes?fields=*,cuenta.id,cuenta.email'
    );
    return data.data;
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filtrarClientePorRFC(data, value);
  };

  const filtrarClientePorRFC = async (clientes, value) => {
    if (value === 'Todo') {
      setListToShow(clientes);
    } else if (clientes)
      setListToShow(
        clientes.filter((item) => item.rfc.includes(value.toUpperCase()))
      );
  };

  const [searchValue, setSearchValue] = useState('');

  const { data } = useQuery('clientes', async () => {
    const result = await fetchItems();
    setListToShow(result);
    filtrarClientePorRFC(result, searchValue);
    return result;
  });
  const [listToShow, setListToShow] = useState([]);

  return (
    <>
      <Input.Search
        onChange={onSearchChange}
        placeholder='Buscar por RFC'
        value={searchValue}
      />
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
              key={item.id}
              actions={[
                <Link to={`/admid/cliente/${item.id}`}>
                  <Button icon={<EditFilled />}></Button>
                </Link>,
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
                    {`${item.rfc}`}
                  </p>
                }
                description={`${item.nombre_comercial}`}
              />
              {`${item.razon_social}`}
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default Index;
