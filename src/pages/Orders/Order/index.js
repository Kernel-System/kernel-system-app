import { Col, Row } from 'antd';
import BoughtProductsList from 'components/shared/BoughtProductsList';
import Heading from 'components/UI/Heading';
import TextLabel from 'components/UI/TextLabel';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { formatPrice } from 'utils';

// TEMPORAL
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

const Order = ({ tipo = 'delivery' }) => {
  const params = useParams();

  useEffect(() => {
    if (tipo === 'delivery') {
      // eslint-disable-next-line no-undef
      PKGEExtWidget.trackBlockIntegrated({
        trackNumber: params.trackNumber,
        containerId: 'track',
        language: 'es',
      });
    }
  }, [params.trackNumber, tipo]);

  return (
    <>
      <Heading
        title={
          tipo === 'delivery'
            ? `Rastreo del pedido #${'1322123'}`
            : `Detalles del pedido #${'123'}`
        }
      />
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <TextLabel title='Nombre' subtitle='Edson David Puente Guerrero' />
          <TextLabel title='Número de teléfono' subtitle='(612) 135-6709' />
          {tipo === 'delivery' && (
            <>
              <TextLabel title='No. de guía' subtitle='RR123456789CN' />
              <TextLabel
                title='Dirección de envío'
                subtitle='Calle No.int. No.ext. Colonia, Estado, Municipio, Localidad, C.P'
              />
            </>
          )}
          <TextLabel title='Fecha del pedido' subtitle='18/03/2021' />
          {tipo === 'delivery' && (
            <TextLabel
              title='Fecha estimada de entrega'
              subtitle='30/03/2021'
            />
          )}
          <TextLabel title='Total' subtitle={formatPrice(12635.23)} />
          <TextLabel title='Productos adquiridos' />
          <BoughtProductsList data={data} />
        </Col>
        {tipo === 'delivery' && (
          <Col xs={24} md={12}>
            <div id='track' />
          </Col>
        )}
      </Row>
    </>
  );
};

export default Order;
