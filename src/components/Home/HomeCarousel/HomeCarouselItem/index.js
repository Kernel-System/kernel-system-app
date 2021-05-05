import { Image } from 'antd';
import { useHistory } from 'react-router';

const HomeCarouselItem = ({ url }) => {
  const history = useHistory();

  const goToOffer = () => {
    history.push(url);
  };

  return (
    <Image
      onClick={goToOffer}
      preview={false}
      style={{ cursor: 'pointer', objectFit: 'cover' }}
      width='100%'
      height={300}
      alt={url}
      src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
      fallback='https://st4.depositphotos.com/17828278/24401/v/600/depositphotos_244011872-stock-illustration-no-image-vector-symbol-missing.jpg'
    />
  );
};

export default HomeCarouselItem;
