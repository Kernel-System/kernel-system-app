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

  function onSearch(val) {
    console.log('search:', val);
  }

  // Por verificar
  return (
    <>
      <Title level={3}>Cuentas</Title>
      <Text>Ordenar por:</Text>
      <br />
      <Select defaultValue='1' style={{ width: 120 }} onChange={handleChange}>
        <Option value='1'>Sin finalizar</Option>
        <Option value='2'>Finalizada</Option>
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
            <Link to={`/cuentas/pagos/${item.id_factura}`}>
              <List.Item key={item.id_factura}>
                <List.Item.Meta
                  //avatar={<Avatar src={item.avatar} />}
                  title={`Cuenta No. ${item.id_factura}`}
                  description={`Folio de Factura no. ${item.folio}`}
                />
                {`${item.fecha} $`}
              </List.Item>
            </Link>
          </Badge.Ribbon>
        )}
      />
      <br />
      <Link to='/cuentas/pagos/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Pago
        </Button>
      </Link>
    </>
  );
};

export default Index;
