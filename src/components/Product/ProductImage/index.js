import { Card, Carousel, Image } from 'antd';

const ProductImage = ({ images }) => {
  return (
    <Card
      size='small'
      style={{ marginBottom: '1rem', minHeight: '342px', height: 'auto' }}
    >
      <Carousel autoplay>
        {images.map((image) => (
          <Image
            key={image.directus_files_id}
            src={`${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${image.directus_files_id}`}
            fallback={
              'https://st4.depositphotos.com/17828278/24401/v/600/depositphotos_244011872-stock-illustration-no-image-vector-symbol-missing.jpg'
            }
            height={300}
            style={{ objectFit: 'contain' }}
          />
        ))}
      </Carousel>
    </Card>
  );
};

export default ProductImage;
