import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, List, Popconfirm } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import Text from 'antd/lib/typography/Text';
import { useHistory } from 'react-router';

const AddressesList = ({ addresses, deleteUserDireccion }) => {
  const breakpoint = useBreakpoint();
  const history = useHistory();

  return (
    <List
      style={{ marginBottom: '1rem' }}
      itemLayout={breakpoint.md ? 'horizontal' : 'vertical'}
      dataSource={addresses}
      renderItem={(address) => (
        <List.Item
          actions={[
            <Button
              onClick={() => history.push(`/direcciones/${address.id}`)}
              icon={<EditFilled />}
              disabled={address.fiscal}
            />,
            <Popconfirm
              title='¿Está seguro que quiere eliminar la dirección?'
              placement='topLeft'
              onConfirm={() => deleteUserDireccion.mutate(address.id)}
              okText='Eliminar'
              okType='danger'
              cancelText='Cancelar'
            >
              <Button
                danger
                icon={<DeleteFilled />}
                disabled={address.fiscal}
              />
            </Popconfirm>,
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
