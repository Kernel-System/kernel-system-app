import { BackTop } from 'antd';
import 'App.css';
import { useStoreActions, useStoreRehydrated } from 'easy-peasy';
import Layout from 'pages/Layout';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import Rutas from 'Rutas';

const App = () => {
  const location = useLocation();
  const rehydrated = useStoreRehydrated();
  const checkAuthState = useStoreActions(
    (actions) => actions.user.checkAuthState
  );

  useEffect(() => {
    if (rehydrated) {
      // checkAuthState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rehydrated, location]);

  return (
    <>
      {rehydrated && (
        <Layout>
          <BackTop />
          <Rutas />
        </Layout>
      )}
    </>
  );
};

export default App;
