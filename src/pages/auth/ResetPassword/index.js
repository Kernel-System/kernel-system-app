import { Button, Col, Form, Input, message, Row } from 'antd';
import { resetPassword } from 'api/auth';
import Heading from 'components/UI/Heading';
import { useQuery } from 'hooks/useQuery';
import { useHistory } from 'react-router';
import { passwordRules } from 'utils/validations/auth';

const ResetPassword = () => {
  const query = useQuery();
  const history = useHistory();

  const onSubmit = ({ newPassword }) => {
    resetPassword(query.get('token'), newPassword)
      .then(() => {
        message.success(
          'Se ha restablecido tu contraseña correctamente',
          2,
          () => history.push('/iniciar-sesion')
        );
      })
      .catch(() => {
        message.error('Lo sentimos, ha ocurrido un error');
      });
  };

  return (
    <>
      <Heading title='Restablecer contraseña' />
      <Row>
        <Col xs={24} lg={12}>
          <Form name='resetPasswordForm' layout='vertical' onFinish={onSubmit}>
            <Form.Item
              name='newPassword'
              label='Nueva contraseña'
              rules={passwordRules}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name='confirmNewPassword'
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
                Establecer nueva contraseña
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default ResetPassword;
