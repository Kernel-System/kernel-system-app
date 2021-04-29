import { Typography } from 'antd';
const { Title, Paragraph, Link } = Typography;

const SignUp = () => (
  <>
    <Title level={3}>Cliente nuevo</Title>
    <Paragraph>
      Si no tienes una cuenta para realizar tus pedidos ¡No te preocupes! solo
      contáctate con nosotros al correo{' '}
      <Link href='mailto:kernel-system@gmail.com'>kernel-system@gmail.com</Link>{' '}
      para darte de alta.
    </Paragraph>
  </>
);
export default SignUp;
