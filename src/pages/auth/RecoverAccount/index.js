import { MailOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { recoverAccount } from 'api/auth';
import Heading from 'components/UI/Heading';
import { useHistory } from 'react-router';
import { emailRules } from 'utils/validations/auth';

const RecoverAccount = () => {
  const history = useHistory();

  const onSubmit = ({ email }) => {
    recoverAccount(email)
      .then(() => {
        message.success(
          `Se ha enviado un correo electrónico a: ${email} para restablecer su contraseña`,
          2,
          () => history.push('/iniciar-sesion')
        );
      })
      .catch(() => {
        message.error('Lo sentimos, ha ocurrido un error');
      });
  };

  return (
    <Row>
      <Col xs={24} lg={12}>
        <Heading
          title='Recuperar cuenta'
          subtitle='Ingrese su correo electrónico con el que se registró y le enviaremos un
        enlace para restablecer su contraseña.'
        />
        <Form name='recoverAccountForm' layout='vertical' onFinish={onSubmit}>
          <Form.Item name='email' label='Correo electrónico' rules={emailRules}>
            <Input prefix={<MailOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Restablecer contraseña
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default RecoverAccount;
