import { List, Typography } from 'antd';
import Heading from 'components/UI/Heading';
import { capitalize } from 'utils/functions';

const { Paragraph } = Typography;

const ProductDetails = ({ especificaciones }) => {
  const newEspecificaciones = Object.entries(especificaciones).filter(
    ([_, value]) => value != null
  );

  return (
    <>
      <Heading title='Especificaciones' />
      <List
        size='small'
        dataSource={newEspecificaciones}
        renderItem={(especificacion) => {
          if (especificacion !== null || especificacion !== undefined) {
            return (
              <List.Item key={especificacion[0]}>
                <Paragraph>
                  - {capitalize(especificacion[0].replaceAll('_', ' '))}:{' '}
                  {capitalize(especificacion[1])}
                </Paragraph>
              </List.Item>
            );
          } else {
            return;
          }
        }}
      />
    </>
  );
};

export default ProductDetails;
