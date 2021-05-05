import { Space, Typography } from 'antd';
const { Title, Paragraph, Text } = Typography;

const Heading = ({ title, subtitle, extra }) => (
  <>
    <Space style={{ width: '100%' }}>
      <Title level={3}>{title}</Title>
      {extra && <Text type='secondary'>{extra}</Text>}
    </Space>
    {subtitle && <Paragraph>{subtitle}</Paragraph>}
  </>
);

export default Heading;
