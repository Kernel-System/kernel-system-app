import { Row, Typography } from 'antd';
import { useEffect, useState } from 'react';
import ProductCard from '../../shared/ProductCard';
const { Title } = Typography;

const HomeProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      await fetch('https://fakestoreapi.com/products')
        .then((res) => res.json())
        .then((json) => setProducts(json));
    };
    getProducts();
  }, []);

  return (
    <>
      <Title level={3}>Productos destacados</Title>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} descuento={0.5} />
        ))}
      </Row>
    </>
  );
};

export default HomeProducts;
