import { getHomeAnuncios } from 'api/home/home_carousel';
import HomeCarousel from 'components/Home/HomeCarousel';
import HomeProducts from 'components/Home/HomeProducts';
import { useStoreState } from 'easy-peasy';
import { useQuery } from 'react-query';
import { Redirect } from 'react-router-dom';

const Home = () => {
  const role = useStoreState((state) => state.user.role);
  const { data, isLoading } = useQuery('home-carousel', getHomeAnuncios);

  let redirect = null;
  switch (role) {
    case 'cuentas por cobrar':
      redirect = <Redirect to='/cuentas' />;
      break;
    case 'encargado de almacen':
      redirect = <Redirect to='/inventario' />;
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
    case 'administrador':
      redirect = <Redirect to='/empleado/perfil' />;
      break;
    default:
      break;
  }

  return (
    <>
      {redirect}
      <HomeCarousel anuncios={data} isLoading={isLoading} />
      <HomeProducts />
    </>
  );
};

export default Home;
