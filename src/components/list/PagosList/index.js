import './styles.css';
import { List, Badge } from 'antd';
import { useState } from 'react';
import PagosModal from 'components/pagos/PagosModal';
import HeaderBack from 'components/UI/HeadingBack';

const Index = ({ list }) => {
  const [visible, setVisible] = useState(false);
  const [clave, setClave] = useState('');
  return (
    <>
      <HeaderBack title='Pagos' />
      <List
        itemLayout='vertical'
        size='default'
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        dataSource={list}
        renderItem={(item) => (
          <Badge.Ribbon text={item.fecha_pago}>
            <List.Item
              key={item.id_pago}
              onClick={() => {
                setVisible(true);
                setClave(item.id_pago);
              }}
            >
              <List.Item.Meta
                //avatar={<Avatar src={item.avatar} />}
                title={`Id de Pago: ${item.id_pago}`}
                description={`Pago No: ${item.num_operacion}`}
              />
              {`Identificador de Factura: ${item.factura}`}
            </List.Item>
          </Badge.Ribbon>
        )}
      />
      <PagosModal
        visible={visible}
        clave={clave}
        setVis={() => {
          setVisible(false);
          setClave('');
        }}
      />
    </>
  );
};

export default Index;
