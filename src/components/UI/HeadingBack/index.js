import { PageHeader } from 'antd';
import { useHistory } from 'react-router';
import Heading from '../Heading';

const HeadingBack = ({ title, subtitle, extra }) => {
  const history = useHistory();
  return (
    <PageHeader
      onBack={() => history.goBack()}
      style={{ padding: '0 0 12px 0' }}
      title={
        <Heading
          title={title}
          subtitle={subtitle}
          extra={extra}
          style={{ marginBottom: 0 }}
        />
      }
    />
  );
};

export default HeadingBack;
