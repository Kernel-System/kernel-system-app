import {
  Select,
  Input,
  Button,
  Space,
  Row,
  Col,
  Form,
  InputNumber,
} from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import TextLabel from 'components/UI/TextLabel';
const { Option } = Select;

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

  const onChangeNumber = (id, value) => {
    const rows = JSON.parse(JSON.stringify(filas));
    rows[id] = {
      ...rows[id],
      cantidad: value,
    };
    onChanged(rows, tag);
    setFilas(rows);
  };

  const changeProduct = (id, value, descripcion) => {
    const rows = JSON.parse(JSON.stringify(filas));
    rows[id] = {
      id: id,
      codigo: value,
      etiqueta: tag,
      cantidad: 1,
      descripcion: descripcion,
    };
    onChanged(rows, tag);
    setFilas(rows);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <TextLabel
        title={isNeeded === false ? `${titulo} (Opcional)` : `${titulo}`}
      />
      {filas.map((fila) => (
        <Row key={fila.id} gutter={[4]} style={{ marginBottom: '20px' }}>
          <Col span={breakpoint.lg ? 12 : 24}>
            <Row key={fila.id} gutter={[4]}>
              <Col xs={16} lg={16}>
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
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value='Codigo1'>Objeto 1</Option>
                    <Option value='Codigo2'>Objeto 2</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={8} lg={8}>
                <InputNumber
                  min={1}
                  max={10}
                  defaultValue={1}
                  onChange={(value) => onChangeNumber(fila.id, value)}
                  disabled={filas[fila.id].codigo !== '' ? false : true}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </Col>
          <Col span={breakpoint.lg ? 12 : 24}>
            <Input
              placeholder='Número de Serie'
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
