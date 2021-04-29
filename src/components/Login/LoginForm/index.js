import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
const { Title, Paragraph } = Typography;

const LoginForm = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <>
      <Title level={3}>Clientes registrados</Title>
      <Paragraph>
        Si tiene una cuenta, ingrese con su correo electrónico.
      </Paragraph>

      <Form name='loginForm' onFinish={onFinish}>
        <Form.Item
          name='email'
          rules={[
            {
              required: true,
              message: 'Por favor introduzca su correo electrónico.',
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder='Correo electrónico' />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[
            { required: true, message: 'Por favor introduzca su contraseña.' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder='Contraseña' />
        </Form.Item>

        <Form.Item>
          <Space direction='vertical'>
            <Button type='primary' htmlType='submit'>
              Iniciar sesión
            </Button>
            <Link to='/recuperar-contrasena' component={Typography.Link}>
              ¿Olvidaste tú contraseña?
            </Link>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginForm;
