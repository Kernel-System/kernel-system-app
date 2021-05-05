import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Typography } from 'antd';
import Heading from 'components/UI/Heading';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <>
      <Heading
        title='Clientes registrados'
        subtitle='Si tiene una cuenta, ingrese con su correo electrónico.'
      />

      <Form
        name='loginForm'
        layout='vertical'
        requiredMark={false}
        onFinish={onFinish}
      >
        <Form.Item
          name='email'
          label='Correo electrónico'
          rules={[
            {
              required: true,
              message: 'Por favor introduzca su correo electrónico.',
            },
            {
              type: 'email',
              message: 'El correo electrónico no tiene un formato válido',
            },
          ]}
        >
          <Input prefix={<MailOutlined />} />
        </Form.Item>

        <Form.Item
          name='password'
          label='Contraseña'
          rules={[
            { required: true, message: 'Por favor introduzca su contraseña.' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item>
          <Space direction='vertical' size='middle'>
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
