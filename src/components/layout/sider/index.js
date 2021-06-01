import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Divider, Input, Layout, Menu } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { useHistory } from 'react-router';
import './style.css';

const { SubMenu } = Menu;
const { Sider } = Layout;

const Index = ({ collapsed, ToggleCollapsed }) => {
  const breakpoint = useBreakpoint();
  const history = useHistory();

  const onSearch = (value) => {
    history.push(`/b/${value}`);
    ToggleCollapsed();
  };

  return (
    <Sider
      className='site-layout-background'
      collapsed={collapsed}
      collapsedWidth={breakpoint.lg ? 80 : 0}
      width={breakpoint.lg ? 200 : '100%'}
      style={{ zIndex: 1 }}
    >
      <Menu mode='inline'>
        {breakpoint.xs && (
          <>
            <Menu.Item key='0' style={{ marginTop: '1.5rem' }}>
              <Input.Search
                placeholder='Buscar...'
                onSearch={onSearch}
                enterButton
                style={{ display: 'block' }}
                size='large'
              />
            </Menu.Item>
            <Divider />
          </>
        )}
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
