import HomeCarousel from 'components/Home/HomeCarousel';
import HomeProducts from 'components/Home/HomeProducts';
import { useStoreState } from 'easy-peasy';
import { Redirect } from 'react-router-dom';

const Home = () => {
  const role = useStoreState((state) => state.user.role);

  let redirect = null;
  switch (role) {
    case 'cuentas por cobrar':
      redirect = <Redirect to='/cuentas' />;
      break;
    case 'encargado de almacen':
      redirect = <Redirect to='/movimiento-almacen' />;
      break;
    case 'encargado de compras':
      redirect = <Redirect to='/compras' />;
      break;
    case 'encargado de ensambles':
      redirect = <Redirect to='/ensambles' />;
      break;
    case 'encargado de ventas':
      redirect = <Redirect to='/venta' />;
      break;
    default:
      break;
  }

  return (
    <>
      {redirect}
      <HomeCarousel />
      <HomeProducts />
    </>
  );
};

export default Home;
