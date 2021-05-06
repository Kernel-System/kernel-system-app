import './styles.css';
import { List, Typography, Button, Badge, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Title, Text } = Typography;
const { Option } = Select;

const Index = ({ list }) => {
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  return (
    <>
      <Title level={3}>Transferencias</Title>
      <Text>Filtrar por:</Text>
      <br />
      <Select
        defaultValue='Creado'
        style={{ width: 120 }}
        onChange={handleChange}
      >
        <Option value='1'>Pendiente</Option>
        <Option value='2'>Tranferido</Option>
        <Option value='3'>Recibido</Option>
      </Select>
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
          <Badge.Ribbon text={item.estado}>
            <Link to={`/ensambles/${item.id}`}>
              <List.Item key={item.id}>
                <List.Item.Meta
                  //avatar={<Avatar src={item.avatar} />}
                  title={`Transferencia No. ${item.id}`}
                  description={item.fechasolicitud}
                />
                {`Del almacen ${item.almacen_origen}, al almacen ${item.almacen_destino}`}
              </List.Item>
            </Link>
          </Badge.Ribbon>
        )}
      />
      <br />
      <Link to='/transferencia/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nueva Transferencia
        </Button>
      </Link>
    </>
  );
};

export default Index;
