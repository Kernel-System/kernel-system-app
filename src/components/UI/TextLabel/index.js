import { Typography } from 'antd';
const { Title, Paragraph } = Typography;

const TextLabel = ({ title, subtitle }) => {
  return (
    <>
      <Title level={5}>{title}</Title>
      {subtitle && <Paragraph type='secondary'>{subtitle}</Paragraph>}
    </>
  );
};

export default TextLabel;
