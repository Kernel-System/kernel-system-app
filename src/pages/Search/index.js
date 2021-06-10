import { Col, Empty, Pagination, Row, Select, Space, Typography } from 'antd';
import { getProductsByCategory, getProductsByName } from 'api/shared/products';
import ProductCard from 'components/shared/ProductCard';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import Heading from 'components/UI/Heading';
import { useState } from 'react';
import { focusManager, useQuery, useQueryClient } from 'react-query';
import { useLocation, useParams } from 'react-router';
const { Text } = Typography;

const Search = () => {
  const { query } = useParams();
  const { pathname } = useLocation();
  const [sortBy, setSortBy] = useState('default');
  const queryClient = useQueryClient();
  const products = useQuery(
    ['search-products', query, sortBy, pathname[1]],
    pathname[1] === 'b'
      ? () => getProductsByName(query, sortBy)
      : () => getProductsByCategory(query, sortBy)
  );
  const productsData = products.data?.data?.data;

  return (
    <>
      <Row justify='space-between'>
        <Col>
          <Heading title={pathname[1] === 'b' ? `Busqueda: ${query}` : query} />
        </Col>
        <Col>
          <Space>
            <Text>Ordenar por:</Text>
            <Select
              defaultValue='default'
              loading={products.isLoading || products.isFetching}
              onChange={(value) => {
                setSortBy(value);
                focusManager.setFocused(true);
                queryClient.invalidateQueries('search-products');
                focusManager.setFocused(false);
              }}
            >
              <Select.Option value='default'>Predeterminado</Select.Option>
              <Select.Option value='menor'>Menor Precio</Select.Option>
              <Select.Option value='mayor'>Mayor Precio</Select.Option>
            </Select>
          </Space>
        </Col>
      </Row>

      {products.isLoading ? (
        <CenteredSpinner />
      ) : productsData.length ? (
        <Space direction='vertical' size='large' style={{ width: '100%' }}>
          <Row gutter={[16, 16]}>
            {productsData.map((product) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={product.codigo}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          <Pagination defaultCurrent={1} total={50} />
        </Space>
      ) : (
        <Empty description='No se encontraron resultados' />
      )}
    </>
  );
};

export default Search;
