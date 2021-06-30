import { Carousel } from 'antd';
import CenteredSpinner from 'components/UI/CenteredSpinner';
import HomeCarouselItem from './HomeCarouselItem';

const HomeCarousel = ({ anuncios, isLoading }) => (
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
    style={{ marginBottom: '1rem', height: 400 }}
  >
    {isLoading ? (
      <CenteredSpinner />
    ) : (
      anuncios?.data?.data.map((anuncio) => (
        <HomeCarouselItem
          key={anuncio.id}
          titulo={anuncio.titulo}
          imagen={anuncio.imagen}
          url={anuncio.url}
        />
      ))
    )}
  </Carousel>
);

export default HomeCarousel;
