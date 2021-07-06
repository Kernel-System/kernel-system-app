import { EditFilled, EyeFilled } from '@ant-design/icons';
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
            style={{ paddingTop: '1.5rem' }}
            actions={[
              <Button
                onClick={() =>
                  history.push(
                    `/empleado/solicitudes-de-compra/${solicitud.id}`
                  )
                }
                icon={
                  solicitud.estado === 'pendiente' ? (
                    <EditFilled />
                  ) : (
                    <EyeFilled />
                  )
                }
              />,
            ]}
          >
            <List.Item.Meta
              title={`#${solicitud.id} - ${solicitud.id_cliente.nombre_comercial}`}
              description={formatDateTime(solicitud.fecha_solicitud, 'long')}
            />
          </List.Item>
        </Badge.Ribbon>
      )}
    />
  );
};

export default SolicitudesCompraList;
