import { Col, Row } from 'antd';
import { getUserOrder } from 'api/profile/orders';
import BoughtProductsList from 'components/shared/BoughtProductsList';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import Heading from 'components/UI/Heading';
import TextLabel from 'components/UI/TextLabel';
import { useStoreState } from 'easy-peasy';
import { useQuery as useQueryHook } from 'hooks/useQuery';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import {
  formatDateTime,
  formatPhoneNumber,
  formatPrice,
} from 'utils/functions';

const Order = () => {
  const params = useParams();
  const query = useQueryHook();
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
      <Heading
        title={`${
          query.get('tipo') === 'envio' ? 'Rastreo' : 'Detalles'
        } de la solicitud de compra`}
        extra={order.isFetched && `No.${orderData?.id}`}
      />
      {order.isLoading ? (
        <CenteredSpinner />
      ) : (
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <TextLabel
              title='Razón social'
              subtitle={orderData?.rfc_cliente.razon_social}
            />
            <TextLabel
              title='Número de teléfono'
              subtitle={formatPhoneNumber(orderData?.rfc_cliente.telefono)}
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
              subtitle={formatDateTime(orderData?.fecha_solicitud)}
            />
            {query.get('tipo') === 'envio' && (
              <TextLabel
                title='Fecha estimada de entrega'
                subtitle='30/03/2021'
              />
            )}
            <TextLabel title='Total' subtitle={formatPrice(orderData?.total)} />
            <TextLabel title='Productos adquiridos' />
            <BoughtProductsList products={orderData?.productos_solicitados} />
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
