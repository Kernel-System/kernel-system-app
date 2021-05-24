import './styles.css';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { List, Button, Badge, Select } from 'antd';
import { useQuery } from 'react-query';
import { http } from 'api';
const { Option } = Select;

const Index = () => {
  const fetchProducts = async () => {
    const { data } = await http.get(
      `/items/ordenes_ensamble?fields=folio,fecha_orden,estado,descripcion`
    );
    return data.data;
  };

  const onSearchChange = (value) => {
    setSearchValue(value);
    filtrarEnsamblesPorEstado(data, value);
  };

  const filtrarEnsamblesPorEstado = async (ensambles, value) => {
    console.log(value);
    if (value === 'Todo') {
      setListToShow(ensambles);
    } else if (ensambles)
      setListToShow(ensambles.filter((item) => item.estado.includes(value)));
  };

  const [searchValue, setSearchValue] = useState('');

  const { data } = useQuery('ensambles', async () => {
    const result = await fetchProducts();
    setListToShow(result);
    filtrarEnsamblesPorEstado(result, searchValue);
    return result;
  });
  const [listToShow, setListToShow] = useState([]);

  return (
    <>
      <Select
        defaultValue='Todo'
        style={{ width: 120 }}
        onChange={onSearchChange}
      >
        <Option value='Todo'>Todo</Option>
        <Option value='Ordenado'>Ordenado</Option>
        <Option value='En ensamble'>En ensamble</Option>
        <Option value='Ensamblado'>Ensamblado</Option>
        <Option value='Ingresado en almacén'>Ingresado en almacén</Option>
      </Select>
      <List
        itemLayout='vertical'
        size='default'
        pagination={{
          onChange: (page) => {
            //changePag(page);
          },
          pageSize: 5,
        }}
        dataSource={listToShow}
        renderItem={(item) => (
          <Badge.Ribbon text={item.estado}>
            <Link to={`/ensambles/${item.folio}`}>
              <List.Item key={item.folio}>
                <List.Item.Meta
                  //avatar={<Avatar src={item.avatar} />}
                  title={`Folio ${item.folio}`}
                  description={item.fecha_orden}
                />
                {item.descripcion}
              </List.Item>
            </Link>
          </Badge.Ribbon>
        )}
      />
      <br />
      <Link to='/ensambles/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nueva Orden de Ensamble
        </Button>
      </Link>
    </>
  );
};

export default Index;
