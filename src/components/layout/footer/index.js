import {
  Layout,
  Typography,
  Image,
  Space,
  Row,
  Button,
  Col,
  Avatar,
} from 'antd';
import { blue } from '@ant-design/colors';
import { ShopOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
const { Footer } = Layout;
const { Text } = Typography;

const Index = () => {
  const breakpoint = useBreakpoint();

  return (
    <Footer>
      <Row align='middle' justify='space-between' gutter={[24, 24]}>
        <Col xs={24} lg={7}>
          <Row gutter={[0, 8]}>
            <Col xs={24} sm={12}>
              <Button type='text' size='small' block={breakpoint.xs}>
                Inicio
              </Button>
            </Col>
            <Col xs={24} sm={12}>
              <Button type='text' size='small' block={breakpoint.xs}>
                Facturación
              </Button>
            </Col>
            <Col xs={24} sm={12}>
              <Button type='text' size='small' block={breakpoint.xs}>
                Categorias
              </Button>
            </Col>
            <Col xs={24} sm={12}>
              <Button type='text' size='small' block={breakpoint.xs}>
                Aviso Legal
              </Button>
            </Col>
            <Col xs={24} sm={12}>
              <Button type='text' size='small' block={breakpoint.xs}>
                Perfil
              </Button>
            </Col>
            <Col xs={24} sm={12}>
              <Button type='text' size='small' block={breakpoint.xs}>
                Términos y condiciones
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xs={24} lg={10}>
          <Space
            direction='vertical'
            style={{ textAlign: 'center', width: '100%' }}
          >
            <Image
              width={80}
              height={80}
              preview={false}
              src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
            />
            <Text>Kernel System © 2021</Text>
          </Space>
        </Col>
        <Col xs={24} lg={7}>
          <Space direction='vertical' size='middle'>
            <Space>
              <Avatar
                icon={<ShopOutlined />}
                style={{ backgroundColor: blue.primary }}
              />
              <Text>
                Calle Márquez de León y Lic. Verdad Col. Centro, C.P. 23000 La
                Paz, Baja California Sur
              </Text>
            </Space>
            <Space>
              <Avatar
                icon={<PhoneOutlined />}
                style={{ backgroundColor: blue.primary }}
              />
              <Text>(612) 348-92-16</Text>
            </Space>
            <Space>
              <Avatar
                icon={<MailOutlined />}
                style={{ backgroundColor: blue.primary }}
              />
              <Text>kernelsystem@gmail.com</Text>
            </Space>
          </Space>
        </Col>
      </Row>
    </Footer>
  );
};

export default Index;
