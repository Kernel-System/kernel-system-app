import { Button, Col, Form, Input, Row } from 'antd';
import Heading from 'components/UI/Heading';

const ChangePassword = () => {
  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <>
      <Heading title='Cambiar contraseña' />
      <Row>
        <Col xs={24} lg={12}>
          <Form
            name='changePasswordForm'
            layout='vertical'
            requiredMark={false}
            onFinish={onFinish}
          >
            <Form.Item name='oldPassword' label='Contraseña actual'>
              <Input.Password />
            </Form.Item>
            <Form.Item name='newPassword' label='Nueva contraseña'>
              <Input.Password />
            </Form.Item>
            <Form.Item
              name='confirmPassword'
              label='Confirmar nueva contraseña'
              dependencies={['newPassword']}
              rules={[
                {
                  required: true,
                  message: 'Por favor ingresa tu nueva contraseña',
                },
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
