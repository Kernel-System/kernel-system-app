import {
  AppstoreOutlined,
  ContainerOutlined,
  DollarOutlined,
  FileTextOutlined,
  ImportOutlined,
  PictureOutlined,
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

  const VentaMenuItem = (
    <Menu.Item
      key='venta'
      icon={<ShopOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/venta'>Punto de Venta</Link>
    </Menu.Item>
  );

  const EnsamblesMenuItem = (
    <Menu.Item
      key='ensambles'
      icon={<ToolOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/ensambles'>Órdenes de ensamble</Link>
    </Menu.Item>
  );

  const ProductosMenuItem = (
    <Menu.Item
      key='productos'
      icon={<AppstoreOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/productos'>Productos</Link>
    </Menu.Item>
  );

  const CuentasMenuItem = (
    <Menu.Item
      key='cuentas'
      icon={<DollarOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/cuentas'>Cuentas</Link>
    </Menu.Item>
  );

  const MovimientosAlmacenMenuItem = (
    <Menu.Item
      key='movimientos'
      icon={<ImportOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/movimientos'>Movimientos de Almacén</Link>
    </Menu.Item>
  );

  const TransferenciaMenuItem = (
    <Menu.Item
      key='transferencia'
      icon={<SwapOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/transferencia'>Transferencias</Link>
    </Menu.Item>
  );

  const ProveedoresMenuItem = (
    <Menu.Item
      key='proveedores'
      icon={<TeamOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/proveedores'>Proveedores</Link>
    </Menu.Item>
  );

  const AnunciosMenuItem = (
    <Menu.Item
      key='anuncios'
      icon={<PictureOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/admin/anuncio'>Anuncios</Link>
    </Menu.Item>
  );

  const SolicitudesCompraMenuItem = (
    <Menu.Item
      key='solicitudes-de-compra'
      icon={<ContainerOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/empleado/solicitudes-de-compra'>Solicitudes de compra</Link>
    </Menu.Item>
  );

  const ComprasMenuItem = (showIcon) => (
    <Menu.Item
      key='compras'
      icon={!showIcon ?? <ShoppingOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/compras'>Compras</Link>
    </Menu.Item>
  );

  const ProductosCompradosMenuItem = (showIcon) => (
    <Menu.Item
      key='productos-comprados'
      icon={!showIcon ?? <ShoppingOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/productos-comprados'>Productos Comprados</Link>
    </Menu.Item>
  );

  const FacturasExternasMenuItem = (showIcon) => (
    <Menu.Item
      key='facturas-externas'
      icon={showIcon ? <FileTextOutlined /> : undefined}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/facturas-externas'>Facturas externas</Link>
    </Menu.Item>
  );

  const FacturasInternasMenuItem = (showIcon) => (
    <Menu.Item
      key='facturas-internas'
      icon={showIcon ? <FileTextOutlined /> : undefined}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/facturas-internas'>Facturas internas</Link>
    </Menu.Item>
  );

  const ComprasSubMenu = (
    <Menu.SubMenu key='subCompras' icon={<ShoppingOutlined />} title='Compras'>
      {ComprasMenuItem()}
      {ProductosCompradosMenuItem()}
    </Menu.SubMenu>
  );

  const FacturasSubMenu = (
    <Menu.SubMenu
      key='subFacturas'
      icon={<FileTextOutlined />}
      title='Facturas'
    >
      {FacturasExternasMenuItem()}
      {FacturasInternasMenuItem()}
    </Menu.SubMenu>
  );

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
      {VentaMenuItem}
      {EnsamblesMenuItem}
      {ProductosMenuItem}
      {SolicitudesCompraMenuItem}
      {FacturasInternasMenuItem(true)}
    </>
  );

  const cuentasPorCobrarMenuItems = <>{CuentasMenuItem}</>;

  const encargadoDeAlmacenMenuItems = (
    <>
      {EnsamblesMenuItem}
      {MovimientosAlmacenMenuItem}
      {TransferenciaMenuItem}
      {ProductosCompradosMenuItem(true)}
    </>
  );

  const encargadoDeComprasMenuItems = (
    <>
      {ComprasSubMenu}
      {ProveedoresMenuItem}
      {ProductosMenuItem}
      {FacturasExternasMenuItem(true)}
    </>
  );

  return (
    <Sider
      collapsed={collapsed}
      collapsedWidth={breakpoint.lg ? 80 : 0}
      width={breakpoint.lg ? 250 : '100vw'}
      style={{ backgroundColor: '#fff', zIndex: 1 }}
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
            {VentaMenuItem}
            {EnsamblesMenuItem}
            {ProductosMenuItem}
            {CuentasMenuItem}
            {MovimientosAlmacenMenuItem}
            {TransferenciaMenuItem}
            {ComprasSubMenu}
            {ProveedoresMenuItem}
            {FacturasSubMenu}
            {AnunciosMenuItem}
            {SolicitudesCompraMenuItem}
          </>
        )}
      </Menu>
    </Sider>
  );
};

export default Index;
