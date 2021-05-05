import './styles.css';
import { List, Typography, Badge, Select } from 'antd';
import { Link } from 'react-router-dom';
const { Title, Text } = Typography;
const { Option } = Select;

const Index = ({ list }) => {
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  return (
    <>
      <Title>Solicitudes de Ensamble</Title>
      <Text>Buscar:</Text>
      <br />
      <Select
        defaultValue='por_aprobar'
        style={{ width: 120 }}
        onChange={handleChange}
      >
        <Option value='por_aprobar'>Por Aprobar</Option>
        <Option value='aprobadas'>Aprobada</Option>
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
                  title={`Solicitud No. ${item.id}`}
                  description={item.fecha_solicitud}
                />
                {item.nombre_cliente}
              </List.Item>
            </Link>
          </Badge.Ribbon>
        )}
      />
    </>
  );
};

export default Index;
