import { MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Typography } from 'antd';
const { Title, Paragraph } = Typography;

const ForgotPassword = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <>
      <Title level={3}>¿Olvidaste tu contraseña?</Title>
      <Paragraph>
        Ingrese su correo electrónico con el que se registró y le enviaremos un
        enlace para reestablecer su contraseña.
      </Paragraph>

      <Form name='forgotPasswordForm' onFinish={onFinish}>
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
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Solicitar contraseña
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ForgotPassword;
