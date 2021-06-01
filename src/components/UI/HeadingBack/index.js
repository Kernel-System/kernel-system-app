import { PageHeader } from 'antd';
import { useHistory } from 'react-router';
import Heading from '../Heading';

const HeadingBack = ({ title, subtitle, extra, actions }) => {
  const history = useHistory();
  return (
    <PageHeader
      onBack={() => history.goBack()}
      style={{ padding: '0 0 12px 0' }}
      extra={actions}
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
