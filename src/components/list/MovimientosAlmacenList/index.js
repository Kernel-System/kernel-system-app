import './styles.css';
import { List, Typography, Button, Badge, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ModalMovimiento from 'components/almacen/ModalMovimiento';
import { useState } from 'react';
const { Title, Text } = Typography;
const { Option } = Select;

const Index = ({ list }) => {
  const [visible, setVisible] = useState(false);
  const [clave, setClave] = useState('');

  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  return (
    <>
      <Title level={3}>Movimientos de almacén</Title>
      <Text>Filtrar por Concepto:</Text>
      <br />
      <Select defaultValue='1' style={{ width: 120 }} onChange={handleChange}>
        <Option value='1'>Concepto 1</Option>
        <Option value='2'>Concepto 2</Option>
        <Option value='3'>Concepto 3</Option>
      </Select>
      <List
        itemLayout='vertical'
        size='default'
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        dataSource={list}
        renderItem={(item) => (
          <Badge.Ribbon text={item.concepto}>
            <List.Item
              key={item.clave}
              onClick={() => {
                setVisible(true);
                setClave(item.clave);
              }}
            >
              <List.Item.Meta
                //avatar={<Avatar src={item.avatar} />}
                title={`Movimiento No. ${item.clave}`}
                description={item.fecha}
              />
              {`${item.comentario}`}
            </List.Item>
          </Badge.Ribbon>
        )}
      />
      <br />
      <Link to='/almacen/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nueva Movimiento
        </Button>
      </Link>
      <ModalMovimiento
        visible={visible}
        clave={clave}
        setVis={() => {
          setVisible(false);
          setClave('');
        }}
      />
    </>
  );
};

export default Index;
