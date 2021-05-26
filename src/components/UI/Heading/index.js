import { Space, Typography } from 'antd';
const { Title, Paragraph, Text } = Typography;

const Heading = ({ title, subtitle, extra, style }) => (
  <>
    <Space style={{ width: '100%' }}>
      <Title level={3} style={style}>
        {title}
      </Title>
      {extra && <Text type='secondary'>{extra}</Text>}
    </Space>
    {subtitle && <Paragraph style={style}>{subtitle}</Paragraph>}
  </>
);

export default Heading;
