import { Card, Carousel, Image } from 'antd';

const ProductImage = ({ images }) => {
  return (
    <Card size='small' style={{ minHeight: '342px' }}>
      {images.length > 0 ? (
        <Carousel
          customPaging={(i) => (
            <button
              style={{
                height: '15px',
                backgroundColor: '#4b8ef7',
              }}
            >
              {i + 1}
            </button>
          )}
          autoplay
        >
          {images.map((image) => (
            <Image
              key={image.directus_files_id}
              src={`${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${image.directus_files_id}`}
              height={300}
              style={{ objectFit: 'contain' }}
              placeholder={!image}
            />
          ))}
        </Carousel>
      ) : (
        <Image
          height={300}
          width={'100%'}
          style={{ objectFit: 'contain' }}
          placeholder
        />
      )}
    </Card>
  );
};

export default ProductImage;
