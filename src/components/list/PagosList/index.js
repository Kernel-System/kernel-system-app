import './styles.css';
import { List, Typography, Button, Badge } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Title } = Typography;

const Index = ({ list }) => {
  return (
    <>
      <Title>Compras</Title>
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
          <Badge.Ribbon text={item.fecha_entrega}>
            <Link to={`/ensambles/${item.idPago}`}>
              <List.Item key={item.idPago}>
                <List.Item.Meta
                  //avatar={<Avatar src={item.avatar} />}
                  title={`Compra No. ${item.idPago}`}
                  description={item.FechaPago}
                />
                {`${item.factura} $`}
              </List.Item>
            </Link>
          </Badge.Ribbon>
        )}
      />
      <br />
      <Link to='/ensambles/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Compra
        </Button>
      </Link>
    </>
  );
};

export default Index;
