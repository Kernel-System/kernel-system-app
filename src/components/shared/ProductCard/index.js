import { PercentageOutlined } from '@ant-design/icons';
import { Badge, Card, Image, Space, Typography } from 'antd';
import { useHistory } from 'react-router-dom';
import { formatPrice } from 'utils/functions';

const { Title, Paragraph, Text } = Typography;

const ProductCard = ({ product, descuento = 0.5 }) => {
  const history = useHistory();

  const goToProduct = (productId) => {
    history.push(`/producto/${productId}`);
  };

  return (
    <Badge.Ribbon
      color='magenta'
      style={{ display: descuento ? 'block' : 'none' }}
      text={
        <Text style={{ color: '#fff' }}>
          <PercentageOutlined /> Oferta!
        </Text>
      }
    >
      <Card
        hoverable
        cover={
          <Image
            preview={false}
            width='100%'
            height={200}
            style={{ objectFit: 'contain', padding: '24px 24px 0' }}
            alt={product.title}
            src={product.image}
            fallback='https://st4.depositphotos.com/17828278/24401/v/600/depositphotos_244011872-stock-illustration-no-image-vector-symbol-missing.jpg'
          />
        }
        onClick={() => goToProduct(product.id)}
      >
        <Text type='secondary'>{product.category.toUpperCase()}</Text>
        <Paragraph ellipsis={{ rows: 2 }} style={{ minHeight: 44 }}>
          {product.title}
        </Paragraph>
        <Space>
          <Title level={3} style={{ display: 'inline-block', marginBottom: 0 }}>
            {formatPrice(product.price * descuento)}
          </Title>
          <Text type={'secondary'} delete>
            {formatPrice(product.price)}
          </Text>
        </Space>
      </Card>
    </Badge.Ribbon>
  );
};

export default ProductCard;
