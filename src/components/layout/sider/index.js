import './style.css';
import { Layout, Menu } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

import {
  AppstoreOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons';
const { SubMenu } = Menu;
const { Sider } = Layout;

const Index = ({ collapsed }) => {
  const breakpoint = useBreakpoint();
  return (
    <Sider
      className='site-layout-background'
      collapsed={collapsed}
      collapsedWidth={breakpoint.lg ? 80 : 0}
      width={breakpoint.lg ? 200 : '100%'}
    >
      <Menu mode='inline'>
        <Menu.Item key='1' icon={<PieChartOutlined />}>
          Option 1
        </Menu.Item>
        <Menu.Item key='2' icon={<DesktopOutlined />}>
          Option 2
        </Menu.Item>
        <Menu.Item key='3' icon={<ContainerOutlined />}>
          Option 3
        </Menu.Item>
        <SubMenu key='sub1' icon={<MailOutlined />} title='Navigation One'>
          <Menu.Item key='5'>Option 5</Menu.Item>
          <Menu.Item key='6'>Option 6</Menu.Item>
          <Menu.Item key='7'>Option 7</Menu.Item>
          <Menu.Item key='8'>Option 8</Menu.Item>
        </SubMenu>
        <SubMenu key='sub2' icon={<AppstoreOutlined />} title='Navigation Two'>
          <Menu.Item key='9'>Option 9</Menu.Item>
          <Menu.Item key='10'>Option 10</Menu.Item>
          <SubMenu key='sub3' title='Submenu'>
            <Menu.Item key='11'>Option 11</Menu.Item>
            <Menu.Item key='12'>Option 12</Menu.Item>
          </SubMenu>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default Index;
