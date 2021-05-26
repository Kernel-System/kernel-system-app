import {
  Col,
  Collapse,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
const { Text } = Typography;

const MetodoPagoModal = ({ visible, onOk, onCancel }) => {
  const [years, setYears] = useState([]);

  const getYears = useCallback(() => {
    let actualYear = new Date().getFullYear();
    for (let i = actualYear; i <= actualYear + 15; i++) {
      setYears((prevYears) => [...prevYears, i.toString().substr(-2)]);
    }
  }, []);

  useEffect(() => {
    getYears();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal
      title='Método de pago'
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText='Pagar'
      cancelText='Regresar'
    >
      <Collapse accordion defaultActiveKey='1'>
        <Collapse.Panel header='Pago en efectivo' key='1'>
          <Form layout='vertical'>
            <Form.Item label='Cantidad recibida'>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label='Cambio'>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel header='Pago con tarjeta de débito o crédito' key='2'>
          <Form layout='vertical'>
            <Form.Item label='Nombre del titular de la tarjeta'>
              <Input />
            </Form.Item>
            <Form.Item label='Número de tarjeta'>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
            <Row gutter={[16, 16]}>
              <Col span={18}>
                <Form.Item label='Fecha de vencimiento (mm/aa)'>
                  <Input.Group>
                    <Space>
                      <Select placeholder='Mes'>
                        <Select.Option value='01'>01</Select.Option>
                        <Select.Option value='02'>02</Select.Option>
                        <Select.Option value='03'>03</Select.Option>
                        <Select.Option value='04'>04</Select.Option>
                        <Select.Option value='05'>05</Select.Option>
                        <Select.Option value='06'>06</Select.Option>
                        <Select.Option value='07'>07</Select.Option>
                        <Select.Option value='08'>08</Select.Option>
                        <Select.Option value='09'>09</Select.Option>
                        <Select.Option value='10'>10</Select.Option>
                        <Select.Option value='11'>11</Select.Option>
                        <Select.Option value='12'>12</Select.Option>
                      </Select>
                      <Text>/</Text>
                      <Select placeholder='Año' style={{ borderLeft: 0 }}>
                        {years.length > 0 &&
                          years.map((year) => (
                            <Select.Option key={year} value={year}>
                              {year}
                            </Select.Option>
                          ))}
                      </Select>
                    </Space>
                  </Input.Group>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='CSC'>
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Collapse.Panel>
      </Collapse>
    </Modal>
  );
};

export default MetodoPagoModal;
