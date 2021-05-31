import './styles.css';
import { useState } from 'react';
import { Popconfirm, List, Button, Input } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { getItems } from 'api/shared/proveedores';

const Index = ({ editItem, onConfirmDelete, onClickItem }) => {
  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filtrarProveedoresPorRFC(data, value);
  };

  const filtrarProveedoresPorRFC = async (proveedores, value) => {
    if (proveedores)
      setListToShow(
        proveedores.filter((item) => item.rfc.includes(value.toUpperCase()))
      );
  };

  const [searchValue, setSearchValue] = useState('');

  const { data } = useQuery('proveedores', async () => {
    const { data } = await getItems();
    const proveedores = data.data;
    setListToShow(proveedores);
    filtrarProveedoresPorRFC(proveedores, searchValue);
    return proveedores;
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
                  {item.rfc}
                </p>
              }
              description={item.razon_social}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default Index;
