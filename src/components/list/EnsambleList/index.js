import './styles.css';
import { List, Typography, Button, Badge, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Title, Text } = Typography;
const { Option } = Select;

const Index = ({ list, changePag }) => {
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  return (
    <>
      <Title level={3}>Órdenes de Ensamble</Title>
      <Text>Ordenar por Estado:</Text>
      <br />
      <Select
        defaultValue='Creado'
        style={{ width: 120 }}
        onChange={handleChange}
      >
        <Option value='Creado'>Creado</Option>
        <Option value='En ensamble'>En ensamble</Option>
        <Option value='Finalizado'>Finalizado</Option>
      </Select>
      <List
        itemLayout='vertical'
        size='default'
        pagination={{
          onChange: (page) => {
            changePag(page);
          },
          pageSize: 5,
        }}
        dataSource={list}
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
