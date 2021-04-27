import "./App.css";
import React, { useState } from "react";
import { Layout } from "antd";
import Header from "./components/layout/header";
import Content from "./components/layout/content";
import Footer from "./components/footer";
import Sider from "./components/layout/sider";

function App() {
  const [collapsed, useCollapsed] = useState(true);

  const ToggleCollapsed = () => {
    useCollapsed(!collapsed);
  };

  return (
    <div className="App">
      <Layout>
        <Header
          collapsed={collapsed}
          ToggleCollapsed={() => {
            ToggleCollapsed();
          }}
        />
        <Layout>
          <Layout>
            <Sider collapsed={collapsed} />
            <Content />
          </Layout>
        </Layout>
        <Footer />
      </Layout>
    </div>
  );
}

export default App;
