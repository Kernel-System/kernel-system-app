import './styles.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { List, Select, Button } from 'antd';
import { EyeFilled, EditFilled } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { http } from 'api';
const { Option } = Select;

const Index = ({ putToken }) => {
  const fetchProducts = async () => {
    const { data } = await http.get(
      `/items/ordenes_ensamble?fields=folio,fecha_orden,estado,descripcion`,
      putToken
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
        itemLayout='horizontal'
        size='default'
        pagination={{
          onChange: (page) => {
            //changePag(page);
          },
          pageSize: 5,
        }}
        dataSource={listToShow}
        renderItem={(item) => (
          <List.Item
            key={item.folio}
            actions={[
              <Link to={`/ensambles/${item.folio}`}>
                <Button
                  icon={
                    item.estado === 'Ingresado en almacén' ? (
                      <EyeFilled />
                    ) : (
                      <EditFilled />
                    )
                  }
                ></Button>
              </Link>,
            ]}
          >
            <List.Item.Meta
              //avatar={<Avatar src={item.avatar} />}
              title={
                <Link to={`/ensambles/${item.folio}`}>
                  <p
                    style={{
                      cursor: 'pointer',
                      margin: 0,
                    }}
                  >
                    {`Folio ${item.folio}`}
                  </p>
                </Link>
              }
              description={`${item.descripcion}: ${item.fecha_orden}`}
            />
            {
              <span
                style={{
                  display: 'inline',
                  opacity: 0.8,
                }}
              >
                <b>{item.estado}</b>
              </span>
            }
          </List.Item>
        )}
      />
    </>
  );
};

export default Index;
