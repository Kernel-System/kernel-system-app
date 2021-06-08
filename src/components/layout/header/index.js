import {
  CloseOutlined,
  LoginOutlined,
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

const Index = ({ collapsed, ToggleCollapsed }) => {
  const breakpoint = useBreakpoint();
  const history = useHistory();
  const isAuth = useStoreState((state) => state.user.isAuth);
  const role = useStoreState((state) => state.user.role);

  const onSearch = (value) => {
    history.push(`/b/${value}`);
  };

  const menu = (
    <Menu>
      <Menu.Item key='1'>
        <Link to={`${role !== 'cliente' ? '/empleado' : ''}/perfil`}>
          Mi perfil
        </Link>
      </Menu.Item>
      {role === 'cliente' && (
        <Menu.Item key='2'>
          <Link to='/solicitudes-de-compra'>Solicitudes de compra</Link>
        </Menu.Item>
      )}
      <Menu.Item key='3'>
        <Link to='/cerrar-sesion'>Cerrar sesión</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header>
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
        {role === 'cliente' || role === undefined
          ? breakpoint.xs || (
              <Col span={12}>
                <Input.Search
                  placeholder='Buscar...'
                  onSearch={onSearch}
                  enterButton
                  style={{ display: 'block' }}
                />
              </Col>
            )
          : null}
        <Col>
          <Space size='middle'>
            {isAuth && role === 'cliente' && (
              <Link to='/lista-de-compra'>
                <Button
                  type='link'
                  icon={<ShoppingCartOutlined style={{ fontSize: '24px' }} />}
                />
              </Link>
            )}
            <Link
              to={
                isAuth
                  ? `${
                      role !== 'cliente' && role !== undefined
                        ? '/empleado'
                        : ''
                    }/perfil`
                  : '/iniciar-sesion'
              }
            >
              <Dropdown
                overlay={isAuth ? menu : <></>}
                overlayStyle={{ zIndex: 99999 }}
              >
                <Button
                  type='link'
                  icon={
                    isAuth ? (
                      <UserOutlined style={{ fontSize: '24px' }} />
                    ) : (
                      <LoginOutlined style={{ fontSize: '24px' }} />
                    )
                  }
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
