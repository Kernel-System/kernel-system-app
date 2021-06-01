import {
  CloseOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Dropdown,
  Input,
  Layout,
  Menu,
  Row,
  Space,
  Typography,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { useStoreState } from 'easy-peasy';
import { Link, useHistory } from 'react-router-dom';
const { Header } = Layout;

const menu = (
  <Menu>
    <Menu.Item key='1'>
      <Link to='/perfil'>Mi perfil</Link>{' '}
    </Menu.Item>
    <Menu.Item key='2'>
      <Link to='/solicitudes-de-compra'>Solicitudes de compra</Link>
    </Menu.Item>
    <Menu.Item key='3'>
      <Link to='/cerrar-sesion'>Cerrar sesión</Link>
    </Menu.Item>
  </Menu>
);

const Index = ({ collapsed, ToggleCollapsed }) => {
  const breakpoint = useBreakpoint();
  const history = useHistory();
  const isAuth = useStoreState((state) => state.user.isAuth);

  const onSearch = (value) => {
    history.push(`/b/${value}`);
  };

  return (
    <Header className='header'>
      <Row justify='space-between' align='middle' wrap={false}>
        <Col>
          <Space size='middle'>
            <Button
              type='link'
              onClick={ToggleCollapsed}
              icon={
                collapsed ? (
                  <MenuOutlined style={{ fontSize: '24px' }} />
                ) : (
                  <CloseOutlined style={{ fontSize: '24px' }} />
                )
              }
            />
            <Link to='/' component={Typography.Link}>
              <strong>KERNEL SYSTEM</strong>
            </Link>
          </Space>
        </Col>
        {breakpoint.xs || (
          <Col span={12}>
            <Input.Search
              placeholder='Buscar...'
              onSearch={onSearch}
              enterButton
              style={{ display: 'block' }}
            />
          </Col>
        )}
        <Col>
          <Space size='middle'>
            {isAuth && (
              <Link to='/lista-de-compra'>
                <Button
                  type='link'
                  icon={<ShoppingCartOutlined style={{ fontSize: '24px' }} />}
                />
              </Link>
            )}
            <Link to='/perfil'>
              <Dropdown overlay={isAuth ? menu : <></>}>
                <Button
                  type='link'
                  icon={<UserOutlined style={{ fontSize: '24px' }} />}
                />
              </Dropdown>
            </Link>
          </Space>
        </Col>
      </Row>
    </Header>
  );
};

export default Index;
