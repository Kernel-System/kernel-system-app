import { Col, Empty, Pagination, Row, Select, Space, Typography } from 'antd';
import { getProductsByCategory, getProductsByName } from 'api/shared/products';
import ProductCard from 'components/shared/ProductCard';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import Heading from 'components/UI/Heading';
import { useState } from 'react';
import { focusManager, useQuery, useQueryClient } from 'react-query';
import { useLocation, useParams } from 'react-router';
import { capitalize } from 'utils/functions';
const { Text } = Typography;

const Search = () => {
  const { query } = useParams();
  const { pathname } = useLocation();
  const [sortBy, setSortBy] = useState('default');
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const products = useQuery(
    ['search-products', query, sortBy, pathname[1], page],
    pathname[1] === 'b'
      ? () => getProductsByName(query, sortBy, page)
      : () => getProductsByCategory(query, sortBy, page)
  );
  const productsData = products.data?.data?.data;

  return (
    <>
      <Row justify='space-between'>
        <Col>
          <Heading
            title={
              pathname[1] === 'b'
                ? `Busqueda: ${capitalize(query)}`
                : capitalize(query)
            }
          />
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
          <Pagination
            current={page}
            total={products.data.data.meta.filter_count}
            pageSize={25}
            onChange={(page) => setPage(page)}
          />
        </Space>
      ) : (
        <Empty description='No se encontraron resultados' />
      )}
    </>
  );
};

export default Search;
