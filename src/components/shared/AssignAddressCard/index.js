import { Card, Typography } from 'antd';
const { Text } = Typography;

const AssignAddressCard = ({ tipo, address }) => {
  return (
    <Card size='small' title={`Dirección ${tipo} por defecto`}>
      <Text>
        {address ? (
          <>
            {address.calle} No.{address.no_ext}
            {address.no_int && `-${address.no_int}`}
            {address.entre_calle_1 && `, entre ${address.entre_calle_1}`}
            {address.entre_calle_2 && ` y ${address.entre_calle_2}`} Col.
            {address.colonia} {address.cp}
            {address.localidad && ` - ${address.localidad}`},{' '}
            {address.municipio}, {address.estado}
            {address.pais && `, ${address.pais}`}
          </>
        ) : (
          'No ha asignado una dirección fiscal por defecto'
        )}
      </Text>
    </Card>
  );
};

export default AssignAddressCard;
