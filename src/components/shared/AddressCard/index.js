import { Typography, Card } from 'antd';
import TextLabel from 'components/UI/TextLabel';
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
          title={
            <TextLabel
              title='Nombre Apellido'
              subtitle='Teléfono: (612) 420-6900'
            />
          }
          actions={[
            <Link key='selectAddress' type='link'>
              Seleccionar
            </Link>,
          ]}
        >
          Calle No. int. No. ext. Colonia, Estado, Municipio, Localidad, C.P.
        </Card>
      )}
    </>
  );
};

export default AddressCard;
