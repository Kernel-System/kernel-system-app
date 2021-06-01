import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, List } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import Text from 'antd/lib/typography/Text';
import { useHistory } from 'react-router';

const AddressesList = ({ addresses, deleteUserDireccion }) => {
  const breakpoint = useBreakpoint();
  const history = useHistory();

  return (
    <List
      itemLayout={breakpoint.md ? 'horizontal' : 'vertical'}
      dataSource={addresses?.data?.data?.data}
      loading={addresses.isLoading}
      renderItem={(address) => (
        <List.Item
          actions={[
            <Button
              onClick={() => history.push(`/direcciones/${address.id}`)}
              icon={<EditFilled />}
              disabled={address.fiscal}
            ></Button>,
            <Button
              danger
              icon={<DeleteFilled />}
              onClick={() => deleteUserDireccion.mutate(address.id)}
              disabled={address.fiscal}
            ></Button>,
          ]}
        >
          <List.Item.Meta
            title={address.fiscal && 'Dirección fiscal'}
            description={
              <Text>
                {address.calle} No. {address.no_ext}
                {address.no_int && `-${address.no_int}`}
                {address.entre_calle_1 && `, entre ${address.entre_calle_1}`}
                {address.entre_calle_2 &&
                  ` y ${address.entre_calle_2}`} Col. {address.colonia}{' '}
                {address.cp}
                {address.localidad && ` - ${address.localidad}`},{' '}
                {address.municipio}, {address.estado}, {address.pais}
              </Text>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default AddressesList;
