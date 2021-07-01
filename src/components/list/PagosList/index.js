import { EditFilled } from '@ant-design/icons';
import { Button, List } from 'antd';
import { http } from 'api';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import './styles.css';

const Index = ({ onClickItem, id_fac, tipo, putToken }) => {
  const [total, setTotal] = useState(0);

  const fetchItems = async () => {
    const { data } = await http.get(
      `/items/pagos?filter[${tipo}][_eq]=${id_fac}&fields=*,archivos_comprobante.*,doctos_relacionados.*,archivos_comprobante.directus_files_id.*,facturas_internas.*,facturas_internas.*`,
      putToken
    );
    setTotal(data.data.map((dato) => dato.monto).reduce((a, b) => a + b, 0));
    return data.data;
  };

  useQuery('pagos', async () => {
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
                    {`Id: ${item.id}`}
                  </p>
                }
                description={`Fecha: ${item.fecha_pago}`}
              />
              {`No. Operación: ${item.num_operacion}`}
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default Index;
