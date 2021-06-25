import { EditFilled } from '@ant-design/icons';
import { Button, List } from 'antd';
import { http } from 'api';
import { useStoreState } from 'easy-peasy';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import './styles.css';

const Index = ({ onClickItem, id_fac, tipo }) => {
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const fetchItems = async () => {
    const { data } = await http.get(
      `/items/pagos_factura?filter[item][_eq]=${id_fac}&filter[collection][_eq]=${tipo}&fields=*,pagos_id.*,pagos_id.archivos_comprobante.*,pagos_id.doctos_relacionados.*,pagos_id.archivos_comprobante.directus_files_id.*`,
      putToken
    );
    return data.data;
  };

  useQuery('clientes', async () => {
    const result = await fetchItems();
    setListToShow(result);
    return result;
  });
  const [listToShow, setListToShow] = useState([]);

  /*
      <Input.Search
        onChange={onSearchChange}
        placeholder='Buscar por RFC'
        value={searchValue}
      />
  */

  return (
    <>
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
                    {`Id: ${item.pagos_id.id}`}
                  </p>
                }
                description={`Fecha: ${item.pagos_id.fecha_pago}`}
              />
              {`No. Operación: ${item.pagos_id.num_operacion}`}
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default Index;
