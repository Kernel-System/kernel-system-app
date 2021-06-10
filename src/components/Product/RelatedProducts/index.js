import { Col, Row } from 'antd';
import ProductCard from 'components/shared/ProductCard';
import Heading from 'components/UI/Heading';

const RelatedProducts = ({ products }) => {
  return (
    <>
      <Heading title='Productos relacionados' />
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} md={12} lg={6} key={product.codigo}>
            <ProductCard product={product} small />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default RelatedProducts;
