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
    />
  );
};

export default HomeCarouselItem;
