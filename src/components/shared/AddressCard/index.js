import { Typography, Card } from 'antd';
import { Link } from 'react-router-dom';
const { Title } = Typography;

const AddressCard = ({ nueva }) => {
  return (
    <>
      {nueva === true ? (
        <Card
          hoverable
          size='small'
          actions={[
            <Link
              key='selectAddress'
              component={Typography.Link}
              to='/direcciones/nueva'
            >
              Añadir
            </Link>,
          ]}
        >
          <Title level={4} style={{ textAlign: 'center' }}>
            Añadir una nueva dirección
          </Title>
        </Card>
      ) : (
        <Card
          hoverable
          size='small'
          title='Nombre Apellido'
          actions={[
            <Link key='selectAddress' type='link'>
              Seleccionar
            </Link>,
          ]}
        >
          Dirección piraña 1
        </Card>
      )}
    </>
  );
};

export default AddressCard;
