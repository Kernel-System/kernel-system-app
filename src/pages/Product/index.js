import { Col, Divider, message, Row } from 'antd';
import { fetchProduct, fetchProducts } from 'api/shared/products';
import ProductDetails from 'components/Product/ProductDetails';
import ProductImage from 'components/Product/ProductImage';
import ProductOverview from 'components/Product/ProductOverview';
import RelatedProducts from 'components/Product/RelatedProducts';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

// TEMPORAL
const especificaciones = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

const Product = () => {
  const { id } = useParams();
  const isAuth = useStoreState((state) => state.user.isAuth);
  const addCartItem = useStoreActions((actions) => actions.cart.addCartItem);
  const productsQuery = useQuery(['products', 4], () => fetchProducts(4));
  const productQuery = useQuery(['product', id], () => fetchProduct(id));

  const addToCart = ({ quantity }) => {
    try {
      addCartItem({ id, quantity });
      message.success('Producto añadido a la lista');
    } catch (error) {
      message.error(`Lo sentimos, ha ocurrido un error`);
    }
  };

  return (
    <Row gutter={24} align='middle'>
      {productQuery.isLoading ? (
        <CenteredSpinner />
      ) : (
        <>
          <Col xs={24} md={8}>
            <ProductImage product={productQuery.data} />
          </Col>
          <Col xs={24} md={16} flex='auto'>
            <ProductOverview
              product={productQuery.data}
              isAuth={isAuth}
              addToCart={addToCart}
            />
          </Col>
          <Divider />
          <Col xs={24}>
            <ProductDetails especificaciones={especificaciones} />
          </Col>
        </>
      )}
      <Divider />
      {productsQuery.isLoading ? (
        <CenteredSpinner />
      ) : (
        <Col xs={24}>
          <RelatedProducts products={productsQuery} />
        </Col>
      )}
    </Row>
  );
};

export default Product;
