import 'App.css';
import Layout from 'pages/Layout';
import Rutas from 'Rutas';

const asyncForgotPassword = asyncComponent(() =>
  import('./pages/ForgotPassword')
);

const App = () => {
  return (
    <Layout>
      <Rutas />
    </Layout>
  );
};

export default App;
