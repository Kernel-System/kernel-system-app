import { Avatar, List, Typography } from 'antd';
import { formatPrice } from 'utils/functions';
const { Paragraph } = Typography;

const BoughtProductsList = ({ data }) => {
  return (
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar
                size='large'
                shape='square'
                src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
              />
            }
            title={<a href='https://ant.design'>{item}</a>}
            description={formatPrice(420)}
          />
          <Paragraph>x1</Paragraph>
        </List.Item>
      )}
    />
  );
};

export default BoughtProductsList;
