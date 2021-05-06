import { Typography } from 'antd';
const { Title, Paragraph } = Typography;

const TextLabel = ({ title, description }) => {
  return (
    <>
      <Title level={5}>{title}</Title>
      {description && <Paragraph type='secondary'>{description}</Paragraph>}
    </>
  );
};

export default TextLabel;
