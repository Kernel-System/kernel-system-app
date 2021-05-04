import { Select, Input, Button, Typography, Space, Row, Col, Form } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
const { Option } = Select;
const { Title } = Typography;

const Index = ({ titulo, isNeeded, noAdd, tag, onChanged }) => {
  const breakpoint = useBreakpoint();
  const [filas, setFilas] = useState([
    {
      id: 0,
      codigo: '',
      cantidad: 0,
      descripcion: '',
    },
  ]);

  const pushFila = () => {
    const rows = JSON.parse(JSON.stringify(filas));
    rows.push({
      id: rows.length,
      codigo: '',
      cantidad: 0,
      descripcion: '',
    });
    setFilas(rows);
  };

  const popFila = () => {
    const rows = JSON.parse(JSON.stringify(filas));
    rows.pop();
    onChanged(rows, tag);
    setFilas(rows);
  };

  const changeProduct = (id, value, descripcion) => {
    const rows = JSON.parse(JSON.stringify(filas));
    rows[id] = {
      id: id,
      codigo: value,
      cantidad: 0,
      descripcion: descripcion,
    };
    onChanged(rows, tag);
    setFilas(rows);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <Title level={4}>
        {isNeeded === false ? `${titulo} (Opcional)` : `${titulo}`}
      </Title>
      {filas.map((fila) => (
        <Row key={fila.id} gutter={[16, 24]} style={{ marginBottom: '10px' }}>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <Form.Item
              name={`${titulo}${fila.id}`}
              rules={[
                isNeeded === false
                  ? { required: false }
                  : {
                      required: true,
                      message: `Asigna un(a) ${titulo.toLowerCase()}`,
                    },
              ]}
            >
              <Select
                showSearch
                key={fila.id}
                size='large'
                style={{ width: '100%' }}
                placeholder='Buscar producto'
                optionFilterProp='children'
                onChange={(value, index) =>
                  changeProduct(fila.id, value, index.children)
                }
                //onFocus={onFocus}
                //onBlur={onBlur}
                //onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value='Codigo1'>Objeto 1</Option>
                <Option value='Codigo2'>Objeto 2</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <Input
              placeholder='Número de Serie'
              size='large'
              style={{ width: '100%' }}
              disabled={true}
            />
          </Col>
        </Row>
      ))}
      {noAdd === true ? null : (
        <Space align='center'>
          <Button
            type='link'
            icon={<PlusCircleOutlined />}
            onClick={() => pushFila()}
          >
            Añadir
          </Button>
          <Button
            type='link'
            icon={<MinusCircleOutlined />}
            danger
            disabled={filas.length === 1 ? true : false}
            onClick={() => popFila()}
          >
            Remover
          </Button>
        </Space>
      )}
    </div>
  );
};

export default Index;
