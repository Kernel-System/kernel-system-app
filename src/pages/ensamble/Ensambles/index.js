import EnsambleList from 'components/list/EnsambleList';
import { Typography } from 'antd';
const { Title, Text } = Typography;

const Index = () => {
  return (
    <div>
      <Title level={3}>Órdenes de Ensamble</Title>
      <Text>Ordenar por Estado:</Text>
      <br />
      <EnsambleList />
    </div>
  );
};

export default Index;
