import { Spin } from 'antd';

const CenteredSpinner = () => {
  return (
    <div style={{ textAlign: 'center', padding: '48px 0', width: '100%' }}>
      <Spin size='large' />
    </div>
  );
};

export default CenteredSpinner;
