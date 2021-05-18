import './styles.css';
import { List, Button, Badge } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Index = ({ list, changePag }) => {
  console.log(list);
  return (
    <>
      <List
        itemLayout='vertical'
        size='default'
        pagination={{
          onChange: (page) => {
            changePag(page);
          },
          pageSize: 5,
        }}
        dataSource={list}
        renderItem={(item) => (
          <Badge.Ribbon text={item.estado}>
            <Link to={`/ensambles/${item.folio}`}>
              <List.Item key={item.folio}>
                <List.Item.Meta
                  //avatar={<Avatar src={item.avatar} />}
                  title={`Folio ${item.folio}`}
                  description={item.fecha_orden}
                />
                {item.descripcion}
              </List.Item>
            </Link>
          </Badge.Ribbon>
        )}
      />
      <br />
      <Link to='/ensambles/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nueva Orden de Ensamble
        </Button>
      </Link>
    </>
  );
};

export default Index;
