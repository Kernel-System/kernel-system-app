import { PercentageOutlined } from '@ant-design/icons';
import { Badge, Card, Image, Space, Typography } from 'antd';
import { useHistory } from 'react-router-dom';
import { formatPrice, toPercent } from 'utils/functions';

const { Title, Paragraph, Text } = Typography;

const ProductCard = ({ product }) => {
  const history = useHistory();

  const goToProduct = (productId) => {
    history.push(`/producto/${productId}`);
  };

  return (
    <Badge.Ribbon
      color='magenta'
      style={{ display: product.descuento > 0 ? 'block' : 'none' }}
      text={
        <Text style={{ color: '#fff' }}>
          {product.descuento}
          <PercentageOutlined /> Descuento!
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
            src={
              product.imagenes.length > 0
                ? `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${product.imagenes[0].directus_files_id}`
                : undefined
            }
            fallback='https://st4.depositphotos.com/17828278/24401/v/600/depositphotos_244011872-stock-illustration-no-image-vector-symbol-missing.jpg'
          />
        }
        onClick={() => goToProduct(product.codigo)}
      >
        <Text type='secondary'>
          {product.categorias.map(
            (categoria, i) =>
              `${categoria.categorias_id.nombre.toUpperCase()}${
                i < product.categorias.length - 1 ? ' / ' : ''
              }`
          )}
        </Text>
        <Paragraph ellipsis={{ rows: 2 }} style={{ minHeight: 44 }}>
          {product.titulo}
        </Paragraph>
        <Space>
          <Title level={3} style={{ display: 'inline-block', marginBottom: 0 }}>
            {formatPrice(product.costo * toPercent(product.descuento))}
          </Title>
          {product.descuento > 0 && (
            <Text type={'secondary'} delete>
              {formatPrice(product.costo)}
            </Text>
          )}
        </Space>
      </Card>
    </Badge.Ribbon>
  );
};

export default ProductCard;
