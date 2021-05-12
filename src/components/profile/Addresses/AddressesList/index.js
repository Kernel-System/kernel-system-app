import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Button, List } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const AddressesList = () => {
  const breakpoint = useBreakpoint();

  // TEMPORAL
  const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];

  return (
    <List
      className='addressesList'
      itemLayout={breakpoint.md ? 'horizontal' : 'vertical'}
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          actions={[
            <Button icon={<EditFilled />}></Button>,
            <Button danger icon={<DeleteFilled />}></Button>,
          ]}
        >
          <List.Item.Meta
            title={<a href='https://ant.design'>{item.title}</a>}
            description='Ant Design, a design language for background applications, is refined by Ant UED Team'
          />
        </List.Item>
      )}
    />
  );
};

export default AddressesList;
