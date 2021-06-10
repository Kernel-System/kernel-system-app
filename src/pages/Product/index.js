import { Col, Divider, message, Row } from 'antd';
import { getProduct, getRelatedProducts } from 'api/shared/products';
import ProductDetails from 'components/Product/ProductDetails';
import ProductImage from 'components/Product/ProductImage';
import ProductOverview from 'components/Product/ProductOverview';
import RelatedProducts from 'components/Product/RelatedProducts';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

const Product = () => {
  const { id } = useParams();
  const isAuth = useStoreState((state) => state.user.isAuth);
  const addCartItem = useStoreActions((actions) => actions.cart.addCartItem);
  const product = useQuery(['product', id], () => getProduct(id));
  const relatedProducts = useQuery('related-products', getRelatedProducts);
  const productData = product.data?.data?.data;

  const addToCart = ({ quantity }) => {
    try {
      addCartItem({ id, quantity });
      message.success('Producto añadido a la lista');
    } catch (error) {
      message.error(`Lo sentimos, ha ocurrido un error`);
    }
  };

  return (
    <Row gutter={24}>
      {product.isLoading ? (
        <CenteredSpinner />
      ) : (
        <>
          <Col xs={24} md={10} lg={8} xl={6}>
            <ProductImage images={productData.imagenes} />
          </Col>
          <Col xs={24} md={14} lg={16} xl={18} flex='auto'>
            <ProductOverview
              product={productData}
              isAuth={isAuth}
              addToCart={addToCart}
            />
          </Col>
          <Divider />
          <Col xs={24}>
            <ProductDetails
              especificaciones={[
                productData.ieps,
                productData.peso,
                productData.unidad_de_medida,
              ]}
            />
          </Col>
        </>
      )}
      <Divider />
      {relatedProducts.isLoading ? (
        <CenteredSpinner />
      ) : (
        <Col xs={24}>
          <RelatedProducts products={relatedProducts.data?.data?.data} />
        </Col>
      )}
    </Row>
  );
};

export default Product;
