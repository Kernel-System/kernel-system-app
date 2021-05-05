import { Typography, Card } from 'antd';
const { Link } = Typography;

const AddressCard = () => {
  return (
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
  );
};

export default AddressCard;
