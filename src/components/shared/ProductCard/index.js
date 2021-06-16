import { PercentageOutlined } from '@ant-design/icons';
import { Badge, Card, Image, Space, Typography } from 'antd';
import { useStoreState } from 'easy-peasy';
import { useHistory } from 'react-router-dom';
import { formatPrice, toPercent } from 'utils/functions';
import { calcPrecioVariable } from 'utils/productos';

const { Title, Paragraph, Text } = Typography;

const ProductCard = ({ product }) => {
  const history = useHistory();
  const nivel = useStoreState((state) => state.user.nivel);

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
            style={{ objectFit: 'contain' }}
            src={
              product.imagenes.length > 0
                ? `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${product.imagenes[0].directus_files_id}`
                : undefined
            }
            placeholder={!product.imagenes.length}
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
            {formatPrice(
              calcPrecioVariable(product, nivel) -
                calcPrecioVariable(product, nivel) *
                  toPercent(product.descuento)
            )}
          </Title>
          {product.descuento > 0 && (
            <Text type={'secondary'} delete>
              {formatPrice(calcPrecioVariable(product, nivel))}
            </Text>
          )}
        </Space>
      </Card>
    </Badge.Ribbon>
  );
};

export default ProductCard;
