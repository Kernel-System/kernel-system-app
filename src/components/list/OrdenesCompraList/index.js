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
      <Title>Órdenes de Compra</Title>
      <Text>Ordenar por:</Text>
      <br />
      <Select
        defaultValue='reciente'
        style={{ width: 120 }}
        onChange={handleChange}
      >
        <Option value='reciente'>Más reciente</Option>
        <Option value='antigua'>Más antiguas</Option>
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
          <Badge.Ribbon text={item.empleado}>
            <Link to={`/ensambles/${item.folio}`}>
              <List.Item key={item.folio}>
                <List.Item.Meta
                  //avatar={<Avatar src={item.avatar} />}
                  title={`Folio ${item.folio}`}
                  description={item.fechacreación}
                />
                {`${item.proveedor} $`}
              </List.Item>
            </Link>
          </Badge.Ribbon>
        )}
      />
      <br />
      <Link to='/ensambles/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nueva Orden de Compra
        </Button>
      </Link>
    </>
  );
};

export default Index;
