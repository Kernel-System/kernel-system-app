import { EyeFilled } from '@ant-design/icons';
import { Badge, Button, List } from 'antd';
import { useHistory } from 'react-router-dom';
import { capitalize, formatDateTime } from 'utils/functions';

const SolicitudesCompraList = ({ solicitudes }) => {
  const history = useHistory();

  return (
    <List
      style={{ marginBottom: '1rem' }}
      dataSource={solicitudes}
      renderItem={(solicitud) => (
        <Badge.Ribbon
          text={capitalize(solicitud.estado)}
          color={
            solicitud.estado === 'aprobada'
              ? 'green'
              : solicitud.estado === 'rechazada'
              ? 'red'
              : 'blue'
          }
        >
          <List.Item
            actions={[
              <Button
                onClick={() =>
                  history.push(
                    `/empleado/solicitudes-de-compra/${solicitud.id}`
                  )
                }
                icon={<EyeFilled />}
              />,
            ]}
          >
            <List.Item.Meta
              title={<>Cliente: {solicitud.id_cliente.nombre_comercial}</>}
              description={
                <>
                  Fecha de solicitud:{' '}
                  {formatDateTime(solicitud.fecha_solicitud, 'long')}
                </>
              }
            />
          </List.Item>
        </Badge.Ribbon>
      )}
    />
  );
};

export default SolicitudesCompraList;
