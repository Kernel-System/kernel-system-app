import { Col, Pagination, Row, Select, Space, Typography } from 'antd';
import {
  fetchProductsByCategory,
  fetchProductsByName,
} from 'api/shared/products';
import ProductCard from 'components/shared/ProductCard';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import Heading from 'components/UI/Heading';
import { useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router';
const { Text } = Typography;

const Search = () => {
  const { query } = useParams();
  const { pathname } = useLocation();

  const products = useQuery(
    ['searchProducts', query],
    pathname[1] === 'b'
      ? () => fetchProductsByName(query)
      : () => fetchProductsByCategory(query)
  );

  return (
    <>
      <Row justify='space-between'>
        <Col>
          <Heading title={pathname[1] === 'b' ? `Busqueda: ${query}` : query} />
        </Col>
        <Col>
          <Space>
            <Text>Ordenar por:</Text>
            <Select defaultValue='default' loading={products.isLoading}>
              <Select.Option value='default'>Predeterminado</Select.Option>
              <Select.Option value='lowestPrice'>Menor Precio</Select.Option>
              <Select.Option value='highestPrice'>Mayor Precio</Select.Option>
            </Select>
          </Space>
        </Col>
      </Row>

      {products.isLoading ? (
        <CenteredSpinner />
      ) : (
        <Space direction='vertical' size='large'>
          <Row gutter={[16, 16]}>
            {products.data.map((product) => (
              <Col xs={24} sm={12} lg={6} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          <Pagination defaultCurrent={1} total={50} />
        </Space>
      )}
    </>
  );
};

export default Search;
