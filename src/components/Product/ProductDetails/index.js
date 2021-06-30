import { Col, List, Row } from 'antd';
import Heading from 'components/UI/Heading';
import { capitalize } from 'utils/functions';

const ProductDetails = ({ especificaciones }) => {
  const newEspecificaciones = Object.entries(especificaciones).filter(
    ([_, value]) => value != null
  );

  return (
    <>
      <Heading title='Especificaciones' />
      <Row>
        <Col xs={24} sm={8}>
          <List
            dataSource={newEspecificaciones}
            renderItem={(especificacion) => {
              if (especificacion !== null || especificacion !== undefined) {
                return (
                  <List.Item>
                    {especificacion[0] !== 'nombre_unidad_cfdi' && (
                      <List.Item.Meta
                        key={especificacion[0]}
                        title={
                          <>
                            ·{' '}
                            {capitalize(especificacion[0].replaceAll('_', ' '))}
                          </>
                        }
                        description={
                          <>
                            {capitalize(especificacion[1])}{' '}
                            {especificacion[0] === 'unidad_de_medida' &&
                              newEspecificaciones.find(
                                (esp) => esp[0] === 'nombre_unidad_cfdi'
                              )[1]}
                          </>
                        }
                      />
                    )}{' '}
                  </List.Item>
                );
              } else {
                return;
              }
            }}
          />
        </Col>
      </Row>
    </>
  );
};

export default ProductDetails;
