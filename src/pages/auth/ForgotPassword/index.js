import { MailOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import Heading from 'components/UI/Heading';

const ForgotPassword = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <Row>
      <Col xs={24} lg={12}>
        <Heading
          title='¿Olvidaste tu contraseña?'
          subtitle='Ingrese su correo electrónico con el que se registró y le enviaremos un
        enlace para reestablecer su contraseña.'
        />
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
      </Col>
    </Row>
  );
};

export default ForgotPassword;
