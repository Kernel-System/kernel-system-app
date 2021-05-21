import { Button, Col, Form, Input, message, Row } from 'antd';
import { changePassword } from 'api/profile';
import Heading from 'components/UI/Heading';
import { useStoreState } from 'easy-peasy';
import { useHistory } from 'react-router';
import { passwordRules } from 'utils/validations/auth';

const ChangePassword = () => {
  const history = useHistory();
  const token = useStoreState((state) => state.user.token.access_token);
  const onFinish = ({ newPassword }) => {
    changePassword(token, newPassword)
      .then(() => {
        message.success('Ha cambiado su contraseña exitosamente');
        history.push('/perfil');
      })
      .catch(() => {
        message.error('Lo sentimos, ha ocurrido un error');
      });
  };

  return (
    <>
      <Heading
        title='Cambiar contraseña'
        subtitle='Por favor introduzca su actual y nueva contraseña'
      />
      <Row>
        <Col xs={24} lg={12}>
          <Form
            name='changePasswordForm'
            layout='vertical'
            requiredMark={false}
            onFinish={onFinish}
          >
            <Form.Item name='newPassword' label='Nueva contraseña'>
              <Input.Password rules={passwordRules} />
            </Form.Item>
            <Form.Item
              name='confirmPassword'
              label='Confirmar nueva contraseña'
              dependencies={['newPassword']}
              rules={[
                ...passwordRules,
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Las contraseñas no coinciden')
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Cambiar contraseña
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default ChangePassword;
