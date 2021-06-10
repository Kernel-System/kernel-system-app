import {
  AppstoreOutlined,
  ContainerOutlined,
  DollarOutlined,
  ImportOutlined,
  ShopOutlined,
  ShoppingOutlined,
  SwapOutlined,
  TeamOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { Divider, Input, Layout, Menu } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { getCategories } from 'api/shared/categories';
import { useStoreState } from 'easy-peasy';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
const { Sider } = Layout;

const Index = ({ collapsed, ToggleCollapsed }) => {
  const breakpoint = useBreakpoint();
  const history = useHistory();
  const role = useStoreState((state) => state.user.role);
  const { data } = useQuery('categories', getCategories);

  const onSearch = (value) => {
    history.push(`/b/${value}`);
    if (!collapsed) {
      ToggleCollapsed();
    }
  };

  const onCategory = (value) => {
    history.push(`/c/${value}`);
    if (!collapsed) {
      ToggleCollapsed();
    }
  };

  const clienteGuestMenuItems = (
    <>
      {breakpoint.xs && (
        <>
          <Menu.Item key='search' style={{ marginTop: '1.5rem' }}>
            <Input.Search
              placeholder='Buscar...'
              onSearch={onSearch}
              enterButton
              style={{ display: 'block' }}
              size='large'
            />
          </Menu.Item>
          <Menu.Item key='divider'>
            <Divider />
          </Menu.Item>
        </>
      )}
      {data?.map((category, i) => (
        <Menu.Item
          key={category.categorias_id.id}
          onClick={() => onCategory(category.categorias_id.nombre)}
        >
          {category.categorias_id.nombre}
        </Menu.Item>
      ))}
    </>
  );

  const encargadoDeVentasMenuItems = (
    <>
      <Menu.Item
        key='venta'
        icon={<ShopOutlined />}
        onClick={!collapsed && ToggleCollapsed}
      >
        <Link to='/venta'>Punto de Venta</Link>
      </Menu.Item>
      <Menu.Item
        key='ensambles'
        icon={<ToolOutlined />}
        onClick={!collapsed && ToggleCollapsed}
      >
        <Link to='/ensambles'>Ensambles</Link>
      </Menu.Item>
      <Menu.Item
        key='productos'
        icon={<AppstoreOutlined />}
        onClick={!collapsed && ToggleCollapsed}
      >
        <Link to='/productos'>Productos</Link>
      </Menu.Item>
    </>
  );

  const cuentasPorCobrarMenuItems = (
    <>
      <Menu.Item
        key='cuentas'
        icon={<DollarOutlined />}
        onClick={!collapsed && ToggleCollapsed}
      >
        <Link to='/cuentas'>Cuentas</Link>
      </Menu.Item>
    </>
  );

  const encargadoDeAlmacenMenuItems = (
    <>
      <Menu.Item
        key='ensambles'
        icon={<ToolOutlined />}
        onClick={!collapsed && ToggleCollapsed}
      >
        <Link to='/ensambles'>Órdenes de ensamble</Link>
      </Menu.Item>
      <Menu.Item
        key='movimiento-almacen'
        icon={<ImportOutlined />}
        onClick={!collapsed && ToggleCollapsed}
      >
        <Link to='/movimiento-almacen'>Movimientos de Almacén</Link>
      </Menu.Item>
      <Menu.Item
        key='transferencia'
        icon={<SwapOutlined />}
        onClick={!collapsed && ToggleCollapsed}
      >
        <Link to='/transferencia'>Transferencias</Link>
      </Menu.Item>
    </>
  );

  const encargadoDeComprasMenuItems = (
    <>
      <Menu.Item
        key='compras'
        icon={<ShoppingOutlined />}
        onClick={!collapsed && ToggleCollapsed}
      >
        <Link to='/compras'>Compras</Link>
      </Menu.Item>
      <Menu.Item
        key='proveedores'
        icon={<TeamOutlined />}
        onClick={!collapsed && ToggleCollapsed}
      >
        <Link to='/proveedores'>Proveedores</Link>
      </Menu.Item>
      <Menu.Item
        key='productos'
        icon={<AppstoreOutlined />}
        onClick={!collapsed && ToggleCollapsed}
      >
        <Link to='/productos'>Productos</Link>
      </Menu.Item>
    </>
  );

  return (
    <Sider
      collapsed={collapsed}
      collapsedWidth={breakpoint.lg ? 80 : 0}
      width={breakpoint.lg ? 250 : '100vw'}
      style={{ backgroundColor: '#fff' }}
    >
      <Menu mode='inline'>
        {role === 'cliente' || role === undefined
          ? clienteGuestMenuItems
          : null}
        {role === 'encargado de ventas' && encargadoDeVentasMenuItems}
        {role === 'cuentas por cobrar' && cuentasPorCobrarMenuItems}
        {role === 'encargado de almacen' && encargadoDeAlmacenMenuItems}
        {role === 'encargado de compras' && encargadoDeComprasMenuItems}
        {role === 'administrador' && (
          <>
            <Menu.SubMenu title='Categorias' icon={<ContainerOutlined />}>
              {clienteGuestMenuItems}
            </Menu.SubMenu>
            {encargadoDeVentasMenuItems}
            {cuentasPorCobrarMenuItems}
            {encargadoDeAlmacenMenuItems}
            {encargadoDeComprasMenuItems}
          </>
        )}
      </Menu>
    </Sider>
  );
};

export default Index;
