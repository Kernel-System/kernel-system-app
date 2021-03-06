import {
  AppstoreOutlined,
  ContainerOutlined,
  DollarOutlined,
  ExportOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  ImportOutlined,
  PictureOutlined,
  ReconciliationOutlined,
  RedEnvelopeOutlined,
  ShopOutlined,
  ShoppingOutlined,
  SnippetsOutlined,
  StockOutlined,
  SwapOutlined,
  TeamOutlined,
  ToolOutlined,
  RollbackOutlined,
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

  const TicketFacturarItem = (
    <Menu.Item
      key='ticket'
      icon={<FileDoneOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/facturar-ticket'>Facturar Ticket de Compra</Link>
    </Menu.Item>
  );

  const TicketFacturarItem2 = (
    <Menu.Item
      key='ticket2'
      icon={<FileDoneOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/facturar-ticket2'>Facturar Ticket de Compra</Link>
    </Menu.Item>
  );

  const VentasMenuItem = (
    <Menu.Item
      key='ventas'
      icon={<StockOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/ventas'>Ventas</Link>
    </Menu.Item>
  );

  const CotizacionMenuItem = (
    <Menu.Item
      key='cotizacion'
      icon={<SnippetsOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/cotizacion-cliente'>Cotizaciones</Link>
    </Menu.Item>
  );

  const InventarioMenuItem = (
    <Menu.Item
      key='inventario'
      icon={<ReconciliationOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/inventario'>Inventario</Link>
    </Menu.Item>
  );

  const EnsamblesMenuItem = (
    <Menu.Item
      key='ensambles'
      icon={<ToolOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/ensambles'>??rdenes de ensamble</Link>
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
      <Link to='/movimientos'>Movimientos de Almac??n</Link>
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

  const RMAsMenuItem = (
    <Menu.Item
      key='rmas'
      icon={<RollbackOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/rmas'>RMAs</Link>
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
      icon={showIcon && <ShoppingOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/compras'>Compras</Link>
    </Menu.Item>
  );

  const DevolucionesClientesMenuItem = (
    <Menu.Item
      key='devolucion-clientes'
      icon={<ExportOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/devolucion-clientes'>Devoluciones</Link>
    </Menu.Item>
  );

  const OrdenesComprasMenuItem = (showIcon) => (
    <Menu.Item
      key='ordenes-compra'
      icon={showIcon && <RedEnvelopeOutlined />}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/ordenes-compra'>Ordenes de Compra</Link>
    </Menu.Item>
  );

  const ProductosCompradosMenuItem = (showIcon) => (
    <Menu.Item
      key='productos-comprados'
      icon={showIcon && <ShoppingOutlined />}
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

  const FacturasGlobalesMenuItem = (showIcon) => (
    <Menu.Item
      key='facturas-globales'
      icon={showIcon ? <FileTextOutlined /> : undefined}
      onClick={!collapsed && ToggleCollapsed}
    >
      <Link to='/facturas-globales'>Facturas globales</Link>
    </Menu.Item>
  );

  const ComprasSubMenu = (
    <Menu.SubMenu key='subCompras' icon={<ShoppingOutlined />} title='Compras'>
      {ComprasMenuItem()}
      {ProductosCompradosMenuItem()}
      {OrdenesComprasMenuItem()}
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
      {role === 'administrador' && <>{FacturasGlobalesMenuItem()} </>}
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
      {TicketFacturarItem2}
    </>
  );

  const encargadoDeVentasMenuItems = (
    <>
      {VentaMenuItem}
      {CotizacionMenuItem}
      {VentasMenuItem}
      {DevolucionesClientesMenuItem}
      {EnsamblesMenuItem}
      {ProductosMenuItem}
      {InventarioMenuItem}
      {SolicitudesCompraMenuItem}
      {FacturasInternasMenuItem(true)}
      {TicketFacturarItem}
    </>
  );

  const cuentasPorCobrarMenuItems = (
    <>
      {CuentasMenuItem}
      {TicketFacturarItem}
    </>
  );

  const encargadoDeAlmacenMenuItems = (
    <>
      {InventarioMenuItem}
      {EnsamblesMenuItem}
      {MovimientosAlmacenMenuItem}
      {TransferenciaMenuItem}
      {ProductosCompradosMenuItem(true)}
      {TicketFacturarItem}
    </>
  );

  const encargadoDeComprasMenuItems = (
    <>
      {ComprasSubMenu}
      {ProductosMenuItem}
      {InventarioMenuItem}
      {RMAsMenuItem}
      {ProveedoresMenuItem}
      {FacturasExternasMenuItem(true)}
      {TicketFacturarItem}
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
        {role === 'encargado de ensambles' && EnsamblesMenuItem}
        {role === 'administrador' && (
          <>
            {VentaMenuItem}
            {CotizacionMenuItem}
            {VentasMenuItem}
            {DevolucionesClientesMenuItem}
            {InventarioMenuItem}
            {EnsamblesMenuItem}
            {ProductosMenuItem}
            {MovimientosAlmacenMenuItem}
            {TransferenciaMenuItem}
            {ComprasSubMenu}
            {ProveedoresMenuItem}
            {RMAsMenuItem}
            {FacturasSubMenu}
            {AnunciosMenuItem}
            {SolicitudesCompraMenuItem}
            {TicketFacturarItem}
          </>
        )}
      </Menu>
    </Sider>
  );
};

export default Index;
