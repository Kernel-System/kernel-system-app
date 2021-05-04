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

  return (
    <>
      <Title>Compras</Title>
      <Select
        showSearch
        style={{ width: 100% }}
        placeholder='Selecciona un proveedor'
        optionFilterProp='children'
        onSearch={onSearch}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value='1'>Proveedor 1</Option>
        <Option value='2'>Proveedor 2</Option>
        <Option value='3'>Proveedor 3</Option>
      </Select>
      <br />
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
          <Badge.Ribbon text={item.fecha_entrega}>
            <Link to={`/ensambles/${item.noCompra}`}>
              <List.Item key={item.noCompra}>
                <List.Item.Meta
                  //avatar={<Avatar src={item.avatar} />}
                  title={`Compra No. ${item.noCompra}`}
                  description={item.fecha_compra}
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
          Añadir Compra
        </Button>
      </Link>
    </>
  );
};

export default Index;
