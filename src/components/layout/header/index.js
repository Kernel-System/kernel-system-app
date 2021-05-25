import './style.css';
import { Layout, Button, Space, Input } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
const { Header } = Layout;
const { Search } = Input;

const Index = ({ collapsed, ToggleCollapsed }) => {
  const onSearch = (value) => console.log(value);

  return (
    <Header className='header'>
      <Space align='center' style={{ width: '100%' }}>
        <Button
          type='link'
          onClick={ToggleCollapsed}
          style={{ verticalAlign: 'middle', marginLeft: '-30px' }}
          size='large'
          icon={
            collapsed ? (
              <MenuUnfoldOutlined style={{ fontSize: '26px' }} />
            ) : (
              <MenuFoldOutlined style={{ fontSize: '26px' }} />
            )
          }
        />
        <Search
          placeholder='input search text'
          onSearch={onSearch}
          style={{ verticalAlign: 'middle' }}
          enterButton
        />
        <Button
          type='link'
          onClick={ToggleCollapsed}
          style={{ float: 'right' }}
          size='large'
          icon={<UserOutlined style={{ fontSize: '26px' }} />}
        />
      </Space>
    </Header>
  );
};

export default Index;
