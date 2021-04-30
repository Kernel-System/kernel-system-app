import { Select, Input, Button, Typography, Space, Row, Col } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
const { Option } = Select;
const { Title } = Typography;

const Index = ({ titulo, puesto }) => {
  const breakpoint = useBreakpoint();

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  const onBlur = () => {
    console.log('blur');
  };

  const onFocus = () => {
    console.log('focus');
  };

  const onSearch = (val) => {
    console.log('search:', val);
  };
  return (
    <div style={{ marginBottom: '20px' }}>
      <Title level={4}>{titulo}</Title>
      <Row gutter={[16, 24]} style={{ marginBottom: '10px' }}>
        <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder='Buscar producto'
            optionFilterProp='children'
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onSearch={onSearch}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value='jack'>Jack</Option>
          </Select>
        </Col>
        <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
          <Input
            placeholder='Número de Serie'
            style={{ width: '100%' }}
            disabled={true}
          />
        </Col>
      </Row>
      <Space align='center'>
        <Button type='link' icon={<PlusCircleOutlined />} onClick>
          Añadir
        </Button>
        <Button
          type='link'
          icon={<MinusCircleOutlined />}
          danger
          disabled={true}
        >
          Remover
        </Button>
      </Space>
    </div>
  );
};

export default Index;
