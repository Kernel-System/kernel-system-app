import { Alert, Col, Row } from 'antd';
import { getUserOrder } from 'api/profile/orders';
import OrderProductsList from 'components/Orders/OrderProductsList';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import HeadingBack from 'components/UI/HeadingBack';
import TextLabel from 'components/UI/TextLabel';
import { useStoreState } from 'easy-peasy';
import { useQueryParams } from 'hooks/useQueryParams';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import {
  capitalize,
  formatDateTime,
  formatPhoneNumber,
  formatPrice,
} from 'utils/functions';

const Order = () => {
  const params = useParams();
  const query = useQueryParams();
  const token = useStoreState((state) => state.user.token.access_token);
  const order = useQuery(['order', params.id], () =>
    getUserOrder(params.id, token)
  );
  const orderData = order?.data?.data?.data;

  useEffect(() => {
    if (query.get('tipo') === 'envio') {
      // eslint-disable-next-line no-undef
      PKGEExtWidget.trackBlockIntegrated({
        trackNumber: params.trackNumber,
        containerId: 'track',
        language: 'es',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HeadingBack
        title={`${
          query.get('tipo') === 'envio' ? 'Rastreo' : 'Detalles'
        } de la solicitud de compra`}
        extra={order.isFetched && `No.${orderData.id}`}
      />
      {order.isLoading ? (
        <CenteredSpinner />
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            {orderData.estado === 'aprobada' ? (
              <Alert
                type='success'
                showIcon
                message='Gracias por su pedido'
                description='Su pedido ha sido aprobado, puede pasar a pagarlo y recorgerlo en su sucursal más cercana.'
                style={{ marginBottom: '1rem' }}
              />
            ) : orderData.estado === 'rechazada' ? (
              <Alert
                type='error'
                showIcon
                message='Lo sentimos'
                description='Su pedido ha sido rechazado, intente realizar otra solicitud de compra.'
                style={{ marginBottom: '1rem' }}
              />
            ) : (
              <Alert
                type='info'
                showIcon
                message='Pedido en proceso de verificación'
                description='Su pedido está siendo verificado, favor de esperar.'
                style={{ marginBottom: '1rem' }}
              />
            )}
            <TextLabel title='Estado' subtitle={capitalize(orderData.estado)} />
            <TextLabel
              title='Número de teléfono'
              subtitle={formatPhoneNumber(orderData.id_cliente.telefono)}
            />
            {query.get('tipo') === 'envio' && (
              <>
                <TextLabel title='No. de guía' subtitle='RR123456789CN' />
                <TextLabel
                  title='Dirección de envío'
                  subtitle='Calle No.int. No.ext. Colonia, Estado, Municipio, Localidad, C.P'
                />
              </>
            )}
            <TextLabel
              title='Fecha del pedido'
              subtitle={formatDateTime(orderData.fecha_solicitud)}
            />
            {query.get('tipo') === 'envio' && (
              <TextLabel
                title='Fecha estimada de entrega'
                subtitle='30/03/2021'
              />
            )}
            <TextLabel title='Total' subtitle={formatPrice(orderData.total)} />
            <TextLabel
              title={`Productos ${
                orderData.estado === 'aprobada' ? 'adquiridos' : 'solicitados'
              }`}
            />
            <OrderProductsList products={orderData.productos_solicitados} />
            <TextLabel
              title='Comentarios'
              subtitle={orderData.comentarios ? orderData.comentarios : '-'}
            />
          </Col>
          {query.get('tipo') === 'envio' && (
            <Col xs={24} md={12}>
              <div id='track' />
            </Col>
          )}
        </Row>
      )}
    </>
  );
};

export default Order;
