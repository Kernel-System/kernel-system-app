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
  const nivel = useStoreState((state) => state.user.nivel);
  const cartItems = useStoreState((state) => state.cart.cartItems);
  const addCartItem = useStoreActions((actions) => actions.cart.addCartItem);
  const product = useQuery(['product', id], () => getProduct(id));
  const productData = product.data?.data?.data;
  const relatedProducts = useQuery(
    ['related-products', id],
    () => getRelatedProducts(id, productData.categorias),
    { enabled: !!productData?.categorias }
  );
  const relatedProductsData = relatedProducts.data?.data?.data;

  const addToCart = ({ quantity }) => {
    try {
      addCartItem({ id, quantity });
      message.success('Producto añadido a la lista');
    } catch (error) {
      message.error('Lo sentimos, ha ocurrido un error');
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
              nivel={nivel}
              cartItems={cartItems}
            />
          </Col>
          <Divider />
          <Col xs={24}>
            <ProductDetails
              especificaciones={{
                ieps: productData.ieps,
                peso: productData.peso,
                unidad_de_medida: productData.unidad_de_medida,
                nombre_unidad_cfdi: productData.nombre_unidad_cfdi,
              }}
            />
          </Col>
        </>
      )}
      <Divider />
      {product.isLoading || relatedProducts.isLoading ? (
        <CenteredSpinner />
      ) : (
        <Col xs={24}>
          <RelatedProducts products={relatedProductsData} />
        </Col>
      )}
    </Row>
  );
};

export default Product;
