import React, { useState, useEffect } from 'react';
import './styles.css';
import { List } from 'antd';

const Index = () => {
  const [data, setData] = useState([]);

  const addData = () => {
    const data2 = [];
    for (let i = 0; i < 23; i++) {
      data2.push({
        href: 'https://ant.design',
        nombre: `nombre ${i + 1}`,
        /*avatar:
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',*/
        description: 'Soy una descripcion',
        content: 'Soy un contenido',
      });
    }
    return data2;
  };

  useEffect(() => {
    setData(addData());
  }, []);

  /*const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );*/

  return (
    <List
      itemLayout="vertical"
      size="default"
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 10,
      }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item
          key={item.nombre}
          onClick={() => {
            console.log('me dieron click bro ' + item.nombre);
          }}
          /*extra={
        <img
          width={272}
          alt="logo"
          src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
        />
      }*/
        >
          <List.Item.Meta
            //avatar={<Avatar src={item.avatar} />}
            title={item.nombre}
            description={item.description}
          />
          {item.content}
        </List.Item>
      )}
    />
  );
};

export default Index;
