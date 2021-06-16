import './styles.css';
import { http } from 'api';
import { useState } from 'react';
import { Popconfirm, List, Button, Select } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
const { Option } = Select;

const Index = ({ onConfirmDelete, onClickItem, putToken }) => {
  const fetchItems = async () => {
    const { data } = await http.get(
      '/items/empleados?fields=*,cuenta.id,cuenta.email',
      putToken
    );
    return data.data;
  };

  const onSearchChange = (e) => {
    const value = e;
    setSearchValue(value);
    filtrarEmpleadoPorPuesto(data, value);
  };

  const filtrarEmpleadoPorPuesto = async (empleados, value) => {
    if (value === 'Todo') {
      setListToShow(empleados);
    } else if (empleados)
      setListToShow(empleados.filter((item) => item.puesto.includes(value)));
  };

  const [searchValue, setSearchValue] = useState('');

  const { data } = useQuery('empleados', async () => {
    const result = await fetchItems();
    setListToShow(result);
    filtrarEmpleadoPorPuesto(result, searchValue);
    return result;
  });
  const [listToShow, setListToShow] = useState([]);

  const switchPuesto = (id) => {
    switch (id) {
      case '002b6741-eff7-4834-8a79-4f80034f6b40':
        return 'Encargado de almacen';
      case '319af35a-79ae-45b3-99f5-0ee2af47973d':
        return 'Encargado de ventas';
      case '39234854-dd25-430d-a6ce-0a6ba3532764':
        return 'Encargado de compras';
      case '39de2a37-7c23-4ca1-9c83-ee7263a7adc7':
        return 'Cuentas por cobrar';
      case '3afe4f4d-7125-45d5-ba57-402221ef956d':
        return 'Encargado de ensamble';
      case 'd5432f92-7a74-4372-907c-9868507e0fd5':
        return 'Administrator';
      default:
        return 'error';
    }
  };

  return (
    <>
      <Select
        style={{ width: '100%' }}
        placeholder='Seleccionar un Puesto'
        optionFilterProp='children'
        defaultValue='Todo'
        onChange={onSearchChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value='Todo' key='Todo'>
          Todo
        </Option>
        <Option
          value='002b6741-eff7-4834-8a79-4f80034f6b40'
          key='002b6741-eff7-4834-8a79-4f80034f6b40'
        >
          Encargado de almacen
        </Option>
        <Option
          value='319af35a-79ae-45b3-99f5-0ee2af47973d'
          key='319af35a-79ae-45b3-99f5-0ee2af47973d'
        >
          Encargado de ventas
        </Option>
        <Option
          value='39234854-dd25-430d-a6ce-0a6ba3532764'
          key='39234854-dd25-430d-a6ce-0a6ba3532764'
        >
          Encargado de compras
        </Option>
        <Option
          value='39de2a37-7c23-4ca1-9c83-ee7263a7adc7'
          key='39de2a37-7c23-4ca1-9c83-ee7263a7adc7'
        >
          Cuentas por cobrar
        </Option>
        <Option
          value='3afe4f4d-7125-45d5-ba57-402221ef956d'
          key='3afe4f4d-7125-45d5-ba57-402221ef956d'
        >
          Encargado de ensamble
        </Option>
        <Option
          value='d5432f92-7a74-4372-907c-9868507e0fd5'
          key='d5432f92-7a74-4372-907c-9868507e0fd5'
        >
          Administrator
        </Option>
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
        renderItem={(item) => {
          return (
            <List.Item
              key={item.rfc}
              actions={[
                <Link to={`/admin/empleado/${item.rfc}`}>
                  <Button icon={<EditFilled />}></Button>
                </Link>,
                item?.cotizaciones?.length === 0 &&
                item?.ordenes_compra?.length === 0 &&
                item?.solicitudes_transferencia?.length === 0 &&
                item?.ventas?.length === 0 &&
                item?.ordenes_ensamble?.length === 0 &&
                item?.ordenes_ensamble_2?.length === 0 ? (
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
                description={`${switchPuesto(item.puesto)}`}
              />
              {`${item.nombre}`}
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default Index;
