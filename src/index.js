import { ConfigProvider } from 'antd';
import es_ES from 'antd/lib/locale/es_ES';
import { StoreProvider } from 'easy-peasy';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from 'react-router-scroll-top';
import { store } from 'store';
import App from './App';

const queryClient = new QueryClient();

ReactDOM.render(
  <StoreProvider store={store}>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <ScrollToTop>
          <ConfigProvider locale={es_ES}>
            <App />
          </ConfigProvider>
        </ScrollToTop>
      </BrowserRouter>
    </QueryClientProvider>
  </StoreProvider>,
  document.getElementById('root')
);
