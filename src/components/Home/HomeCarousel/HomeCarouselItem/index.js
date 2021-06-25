import { Image } from 'antd';

const HomeCarouselItem = ({ titulo, imagen, url }) => (
  <a href={url}>
    <Image
      preview={false}
      style={{ cursor: 'pointer', objectFit: 'cover' }}
      width='100%'
      height={400}
      alt={titulo}
      src={`${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${imagen}`}
    />
  </a>
);
export default HomeCarouselItem;
