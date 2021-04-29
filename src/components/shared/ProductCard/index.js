import { PercentageOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Divider, Image, Typography } from 'antd';
import { formatPrice } from '../../../lib/utility';

const { Title, Paragraph, Text } = Typography;

const ProductCard = ({ product, descuento }) => (
  <Col xs={24} sm={12} lg={6} xl={4}>
    <Badge.Ribbon
      color='magenta'
      style={{ display: descuento ? 'block' : 'none' }}
      text={
        <Text strong style={{ color: '#fff' }}>
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
            style={{ objectFit: 'contain', padding: 16 }}
            alt={product.title}
            src={product.image}
            fallback='https://st4.depositphotos.com/17828278/24401/v/600/depositphotos_244011872-stock-illustration-no-image-vector-symbol-missing.jpg'
          />
        }
      >
        <Paragraph ellipsis={{ rows: 2 }} style={{ minHeight: 44 }}>
          {product.title}
        </Paragraph>
        <Title level={3} style={{ display: 'inline' }}>
          {formatPrice(product.price * descuento)}{' '}
        </Title>
        <Text type={'secondary'} delete>
          {formatPrice(product.price)}
        </Text>
        <Divider style={{ margin: '16px 0' }} />
        <Button block type='primary' icon={<ShoppingCartOutlined />}>
          Añadir a la lista
        </Button>
      </Card>
    </Badge.Ribbon>
  </Col>
);
export default ProductCard;
