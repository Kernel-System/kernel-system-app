import "./style.css";
import { Layout, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
const { Header} = Layout;

const Index = ({collapsed,ToggleCollapsed}) => {
  return (
      <Header className="header">
        <Button
          type="link"
          onClick={ToggleCollapsed}
          style={{ verticalAlign: "middle", marginLeft:"-30px"}}
          size="large"
          icon={
            collapsed ? (
              <MenuUnfoldOutlined style={{ fontSize: '26px' }} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: '26px' }} />
            )
          }
        ></Button>
      </Header>
  );
};

export default Index;
