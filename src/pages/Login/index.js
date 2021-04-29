import { Col, Row } from 'antd';
import LoginForm from '../../components/Login/LoginForm';
import SignUp from '../../components/Login/SignUp';

const Login = () => {
  return (
    <Row gutter={{ xs: 0, md: 32 }}>
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
