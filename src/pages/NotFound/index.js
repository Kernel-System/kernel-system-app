import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <Result
    status='404'
    title='Página no encontrada'
    subTitle='Lo sentimos, la página que has visitado no existe.'
    extra={
      <Link to='/'>
        <Button type='primary' size='large'>
          Volver al inicio
        </Button>
      </Link>
    }
  />
);

export default NotFound;
