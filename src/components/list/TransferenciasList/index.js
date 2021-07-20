import './styles.css';
import { http } from 'api';
import { useState } from 'react';
import { List, Button, Input, Space } from 'antd';
import { EditFilled, EyeFilled } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
import moment from 'moment';

const formatoFecha = 'DD MMMM YYYY, hh:mm:ss a';

const Index = () => {
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const fetchTransferencia = async () => {
    const { data } = await http.get(
      '/items/solicitudes_transferencia',
      putToken
    );
    return data.data;
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filtrarTransferenciasPorEstado(data, value);
  };

  const filtrarTransferenciasPorEstado = async (ensambles, value) => {
    if (value === 'Todo') {
      setListToShow(ensambles);
    } else if (ensambles)
      setListToShow(ensambles.filter((item) => item.estado.includes(value)));
  };

  const [searchValue, setSearchValue] = useState('');

  const { data } = useQuery('transferencia', async () => {
    const result = await fetchTransferencia();
    setListToShow(result);
    filtrarTransferenciasPorEstado(result, searchValue);
    return result;
  });
  const [listToShow, setListToShow] = useState([]);

  return (
    <>
      <Input.Search
        onChange={onSearchChange}
        placeholder='Buscar por estado'
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
            key={item.id}
            actions={[
              <Link to={`/transferencia/mostrar/${item.id}`}>
                <Button icon={<EyeFilled />}></Button>
              </Link>,
              <Space>
                <Link to={`/transferencia/editar/${item.id}`}>
                  <Button icon={<EditFilled />} />
                </Link>
              </Space>,
            ]}
          >
            <List.Item.Meta
              title={
                <Link to={`/transferencia/mostrar/${item.id}`}>
                  <p
                    style={{
                      cursor: 'pointer',
                      margin: 0,
                    }}
                  >
                    {`Transferencia del almacén ${item.almacen_origen} al almacén ${item.almacen_destino}`}
                  </p>
                </Link>
              }
              description={`Solicitado el ${moment(
                new Date(item.fecha_solicitud)
              ).format(formatoFecha)}`}
            />
            {
              <span
                style={{
                  display: 'inline',
                  opacity: 0.8,
                }}
              >
                Estado: <b>{item.estado}</b>
              </span>
            }
          </List.Item>
        )}
      />
    </>
  );
};

export default Index;
