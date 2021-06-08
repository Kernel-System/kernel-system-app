import { Col, Row } from 'antd';
import { getHomeProducts } from 'api/shared/products';
import ProductCard from 'components/shared/ProductCard';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import Heading from 'components/UI/Heading';
import { useQuery } from 'react-query';

const HomeProducts = () => {
  const { isLoading, data } = useQuery('home-products', getHomeProducts);

  return (
    <>
      <Heading title='Productos destacados' />
      {isLoading ? (
        <CenteredSpinner />
      ) : (
        <Row gutter={[16, 16]}>
          {data?.data?.data.map((product) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={product.codigo}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeProducts;
