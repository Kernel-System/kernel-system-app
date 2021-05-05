import Heading from 'components/UI/Heading';

const SignUp = () => (
  <Heading
    title='Cliente nuevo'
    subtitle={
      <>
        Si no tienes una cuenta para realizar tus pedidos ¡No te preocupes! solo
        contáctate con nosotros al correo{' '}
        <a href='mailto:kernel-system@gmail.com'>kernel-system@gmail.com</a>
        para darte de alta.
      </>
    }
  />
);
export default SignUp;
