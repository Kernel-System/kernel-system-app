import { Carousel } from 'antd';
import HomeCarouselItem from './HomeCarouselItem';

const HomeCarousel = () => (
  <Carousel autoplay style={{ marginBottom: '1em' }}>
    <HomeCarouselItem url={'www.google.com'} />
    <HomeCarouselItem url={'www.google.com'} />
    <HomeCarouselItem url={'www.google.com'} />
    <HomeCarouselItem url={'www.google.com'} />
  </Carousel>
);

export default HomeCarousel;
