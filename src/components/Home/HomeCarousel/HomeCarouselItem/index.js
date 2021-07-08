import { Image } from 'antd';
import { Link } from 'react-router-dom';

const HomeCarouselItem = ({ titulo, imagen, url }) => (
  <Link to={url.slice(21)}>
    <Image
      preview={false}
      style={{ cursor: 'pointer', objectFit: 'cover' }}
      width='100%'
      height={400}
      alt={titulo}
      src={`${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${imagen}`}
    />
  </Link>
);

export default HomeCarouselItem;
