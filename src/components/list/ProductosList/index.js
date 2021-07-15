import './styles.css';
import { http } from 'api';
import { useState } from 'react';
import { Popconfirm, List, Button, Input, Space, Tag } from 'antd';
import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  WarningTwoTone,
} from '@ant-design/icons';
import { useQuery } from 'react-query';
import { categoriasProductos } from 'utils/facturas/catalogo';
import { Link } from 'react-router-dom';

const Index = ({ putToken, onConfirmDelete }) => {
  const fetchProducts = async () => {
    const { data } = await http.get('/items/productos', putToken);
    console.log(data.data);
    return data.data;
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filtrarProducto(data, value);
  };

  const filtrarProducto = async (productos, value) => {
    if (productos)
      setListToShow(
        productos.filter(
          (item) =>
            item.titulo.toUpperCase().includes(value.toUpperCase()) ||
            item.codigo.toUpperCase().includes(value.toUpperCase())
        )
      );
  };

  const [searchValue, setSearchValue] = useState('');

  const { data } = useQuery('productos', async () => {
    const result = await fetchProducts();
    setListToShow(result);
    filtrarProducto(result, searchValue);
    return result;
  });
  const [listToShow, setListToShow] = useState([]);

  return (
    <>
      <Input.Search
        onChange={onSearchChange}
        placeholder='Buscar por nombre o código'
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
          const eliminarDesactivado =
            item.productos_solicitados?.length || item.inventario?.length;
          return (
            <List.Item
              key={item.codigo}
              actions={[
                <Link to={`/productos/mostrar/${item.codigo}`}>
                  <Button icon={<EyeFilled />}></Button>
                </Link>,
                <Space>
                  <Link to={`/productos/editar/${item.codigo}`}>
                    <Button icon={<EditFilled />} />
                  </Link>
                  {
                    <Popconfirm
                      placement='left'
                      {...{
                        icon: eliminarDesactivado ? (
                          <WarningTwoTone twoToneColor='red' />
                        ) : undefined,
                      }}
                      title={
                        eliminarDesactivado
                          ? 'Existe inventario o solicitudes de este producto.'
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
                        disabled={eliminarDesactivado}
                        icon={<DeleteFilled />}
                      />
                    </Popconfirm>
                  }
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
                      {item.codigo + ' - ' + item.titulo}
                    </p>
                  </Link>
                }
                description={`${item.descripcion}`}
              />
              {item.categorias.map((cat) => {
                return <Tag key={cat}>{categoriasProductos[cat]}</Tag>;
              })}
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default Index;
