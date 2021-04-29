import { Carousel } from 'antd';
import HomeCarouselItem from './HomeCarouselItem';

const HomeCarousel = () => (
  <Carousel autoplay>
    <HomeCarouselItem url={1} />
    <HomeCarouselItem url={2} />
    <HomeCarouselItem url={3} />
    <HomeCarouselItem url={4} />
  </Carousel>
);

export default HomeCarousel;
