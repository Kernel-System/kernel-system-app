import { Col, Row } from 'antd';
import LoginForm from 'components/auth/Login/LoginForm';
import SignUp from 'components/auth/Login/SignUp';

const Login = () => {
  return (
    <Row gutter={24}>
      <Col xs={24} md={12}>
        <LoginForm />
      </Col>
      <Col xs={24} md={12}>
        <SignUp />
      </Col>
    </Row>
  );
};

export default Login;
