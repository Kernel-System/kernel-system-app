import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, message, Space, Typography } from 'antd';
import { getToken } from 'api/auth';
import Heading from 'components/UI/Heading';
import { useStoreActions } from 'easy-peasy';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { emailRules } from 'utils/validations/auth';

const LoginForm = () => {
  const history = useHistory();
  const login = useStoreActions((actions) => actions.user.login);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const onSubmit = ({ email, password }) => {
    setLoading(true);
    getToken(email, password)
      .then(({ data: { data } }) => {
        setLoading(false);
        login(data);
        history.push('/');
      })
      .catch(({ response: { status } }) => {
        if (status !== 401) {
          message.error(`Lo sentimos, ha ocurrido un error`);
        }
        setLoading(false);
        setHasError(true);
      });
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
        onFinish={onSubmit}
        onValuesChange={() => setHasError(false)}
      >
        {hasError && (
          <Form.Item>
            <Alert
              type='error'
              description={
                <>
                  Contraseña incorrecta. Reinténtalo o{' '}
                  <Link to='/recuperar-cuenta' component={Typography.Link}>
                    restablece la contraseña
                  </Link>
                  .
                </>
              }
            />
          </Form.Item>
        )}
        <Form.Item name='email' label='Correo electrónico' rules={emailRules}>
          <Input prefix={<MailOutlined />} />
        </Form.Item>

        <Form.Item
          name='password'
          label='Contraseña'
          rules={[
            { required: true, message: 'Por favor introduzca su contraseña' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item>
          <Space direction='vertical' size='middle'>
            <Button type='primary' htmlType='submit' loading={loading}>
              Iniciar sesión
            </Button>
            <Link to='/recuperar-cuenta' component={Typography.Link}>
              ¿Olvidaste tú contraseña?
            </Link>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginForm;
