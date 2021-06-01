import { Input, Typography, Row, Col, Select, Menu } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const { SubMenu } = Menu;

const Index = () => {
  const breakpoint = useBreakpoint();

  const handleClick = (e) => {
    console.log('click ', e);
  };

  return (
    <div>
      <Row key='columnas' gutter={[16, 8]} style={{ marginBottom: '10px' }}>
        <Col
          className='gutter-row'
          span={breakpoint.lg ? 16 : 24}
          style={{ marginBottom: '10px' }}
        >
          1
        </Col>
        <Col
          className='gutter-row'
          span={breakpoint.lg ? 8 : 24}
          style={{ marginBottom: '10px' }}
        >
          <Menu
            onClick={handleClick}
            style={{ width: 256 }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode='inline'
          >
            <Menu.Item key='1'>Panel de Administrador</Menu.Item>
            <Menu.Item key='2'>Notificaciones</Menu.Item>
            <Menu.Item key='3'>Órdenes de Ensamble</Menu.Item>
            <SubMenu key='sub1' /*icon={<MailOutlined />}*/ title='Tienda'>
              <Menu.Item key='4'>Sucursales</Menu.Item>
              <Menu.Item key='5'>Almacenes</Menu.Item>
              <Menu.Item key='6'>Empleados</Menu.Item>
              <Menu.Item key='7'>Clientes</Menu.Item>
            </SubMenu>
            <SubMenu key='sub2' /*icon={<MailOutlined />}*/ title='Compras'>
              <Menu.Item key='8'>Ordenes de Compra</Menu.Item>
              <Menu.Item key='9'>Solicitudes de Compras</Menu.Item>
              <Menu.Item key='10'>Compras</Menu.Item>
              <Menu.Item key='11'>Proveedores</Menu.Item>
            </SubMenu>
          </Menu>
        </Col>
      </Row>
    </div>
  );
};

export default Index;
