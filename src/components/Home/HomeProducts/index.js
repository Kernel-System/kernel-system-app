import { Col, Row } from 'antd';
import { fetchProducts } from 'api/shared/products';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import Heading from 'components/UI/Heading';
import { useQuery } from 'react-query';
import ProductCard from '../../shared/ProductCard';

const HomeProducts = () => {
  const { isLoading, data } = useQuery('products', fetchProducts);

  return (
    <>
      <Heading title='Productos destacados' />

      {isLoading ? (
        <CenteredSpinner />
      ) : (
        <Row gutter={[16, 16]}>
          {data.map((product) => (
            <Col xs={24} sm={12} lg={6} key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeProducts;
