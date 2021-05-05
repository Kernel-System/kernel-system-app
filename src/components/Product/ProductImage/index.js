import { Image } from 'antd';

const ProductImage = ({ product }) => {
  return (
    <Image src={product.image} height={300} style={{ objectFit: 'contain' }} />
  );
};

export default ProductImage;
