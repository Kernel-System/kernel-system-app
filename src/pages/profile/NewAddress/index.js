import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
} from 'antd';
import Heading from 'components/UI/Heading';
const { Title } = Typography;

const NewAddress = () => {
  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <>
      <Heading title='Añadir nueva dirección' />
      <Row>
        <Col xs={24} lg={12}>
          <Form name='newAddressForm' layout='vertical' onFinish={onFinish}>
            <Title level={5}>Información de contacto</Title>
            <Form.Item name='firstName' label='Nombre(s)'>
              <Input />
            </Form.Item>
            <Form.Item name='lastName' label='Apellidos'>
              <Input />
            </Form.Item>
            <Form.Item name='phone' label='Número de teléfono'>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Divider />

            <Title level={5}>Dirección</Title>
            <Form.Item name='calle' label='Calle'>
              <Input />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item name='entrecalle1' label='Entre calle 1'>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name='entrecalle2' label='Entre calle 2'>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name='numInterior' label='No. Int.'>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name='numExterior' label='No. Ext.'>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name='codigopostal' label='Código Postal'>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name='estado' label='Estado'>
                  <Select>
                    <Select.Option value='red'>Red</Select.Option>
                    <Select.Option value='green'>Green</Select.Option>
                    <Select.Option value='blue'>Blue</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name='municipio' label='Municipio'>
                  <Select>
                    <Select.Option value='red'>Red</Select.Option>
                    <Select.Option value='green'>Green</Select.Option>
                    <Select.Option value='blue'>Blue</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name='localidad' label='Localidad'>
                  <Select>
                    <Select.Option value='red'>Red</Select.Option>
                    <Select.Option value='green'>Green</Select.Option>
                    <Select.Option value='blue'>Blue</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name='colonia' label='Colonia'>
                  <Select>
                    <Select.Option value='red'>Red</Select.Option>
                    <Select.Option value='green'>Green</Select.Option>
                    <Select.Option value='blue'>Blue</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item>
                  <Row gutter={[0, 16]}>
                    <Col xs={24}>
                      <Checkbox>
                        Usar como mi dirección de envío por defecto
                      </Checkbox>
                    </Col>
                    <Checkbox>
                      <Col xs={24}>
                        Usar como mi dirección de facturación por defecto
                      </Col>
                    </Checkbox>
                  </Row>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item>
                  <Button type='primary' htmlType='submit'>
                    Añadir dirección
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default NewAddress;
