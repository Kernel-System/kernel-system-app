import { blue } from '@ant-design/colors';
import {
  EnvironmentOutlined,
  MailOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import { Avatar, Col, Image, Layout, Row, Space, Typography } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { Link as RouterLink } from 'react-router-dom';
const { Footer } = Layout;
const { Text, Link } = Typography;

const Index = () => {
  const breakpoint = useBreakpoint();

  return (
    <Footer style={{ backgroundColor: '#001529' }}>
      <Row align='middle' justify='space-around' gutter={[0, 24]}>
        <Col xs={24} md={9}>
          <Row
            gutter={[0, 16]}
            style={{ textAlign: !breakpoint.md && 'center' }}
          >
            <Col xs={24} sm={12}>
              <RouterLink to='/' style={{ display: 'block' }}>
                Inicio
              </RouterLink>
            </Col>
            <Col xs={24} sm={12}>
              <RouterLink to='/facturar-ticket2' style={{ display: 'block' }}>
                Facturación
              </RouterLink>
            </Col>
            <Col xs={24} sm={12}>
              <RouterLink to='/aviso-legal' style={{ display: 'block' }}>
                Aviso Legal
              </RouterLink>
            </Col>
            <Col xs={24} sm={12}>
              <RouterLink
                to='/terminos-y-condiciones'
                style={{ display: 'block' }}
              >
                Términos y Condiciones
              </RouterLink>
            </Col>
          </Row>
        </Col>
        <Col xs={24} md={6}>
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
            <Text style={{ color: '#CCC' }}>Kernel System © 2021</Text>
          </Space>
        </Col>
        <Col xs={24} md={9}>
          <Space direction='vertical' size='middle'>
            <Space>
              <Avatar
                icon={<EnvironmentOutlined />}
                style={{ backgroundColor: blue.primary }}
              />
              <Link
                href='https://goo.gl/maps/vfNVkuTYjS25Kc2b6'
                rel='noreferrer'
                target='_blank'
              >
                Calle Márquez de León y Lic. Verdad Col. Centro, C.P. 23000 La
                Paz, Baja California Sur
              </Link>
            </Space>
            <Space>
              <Avatar
                icon={<WhatsAppOutlined />}
                style={{ backgroundColor: blue.primary }}
              />
              <Link
                href='https://wa.me/6123489216'
                rel='noreferrer'
                target='_blank'
              >
                (612) 348-9216
              </Link>
            </Space>
            <Space>
              <Avatar
                icon={<MailOutlined />}
                style={{ backgroundColor: blue.primary }}
              />
              <Link href='mailto:kernelsystem@gmail.com'>
                kernelsystem@gmail.com
              </Link>
            </Space>
          </Space>
        </Col>
      </Row>
    </Footer>
  );
};

export default Index;
