import {
  Col,
  Collapse,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { usosCfdi } from 'utils/facturas/catalogo';
import { formatPrice, isEmptyObject, toPercent } from 'utils/functions';
import { calcPrecioVariable } from 'utils/productos';
import {
  calleRules,
  coloniaRules,
  cpRules,
  entreCalleRules,
  estadoRules,
  localidadRules,
  municipioRules,
  noExtRules,
  noIntRules,
  paisRules,
} from 'utils/validations/address';
const { Text } = Typography;
const { Option } = Select;

const MetodoPagoModal = ({
  products,
  visible,
  onOk,
  onCancel,
  tipoComprobante,
  metodoPago,
  nivel,
  cliente,
}) => {
  const [form] = Form.useForm();
  const [years, setYears] = useState([]);
  const [cantidadRecibida, setCantidadRecibida] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const getYears = useCallback(() => {
    let actualYear = new Date().getFullYear();
    for (let i = actualYear; i <= actualYear + 10; i++) {
      setYears((prevYears) => [...prevYears, i.toString().substr(-2)]);
    }
  }, []);

  useEffect(() => {
    getYears();
    if (!isEmptyObject(cliente)) {
      form.setFieldsValue({
        razon_social: cliente?.razon_social,
        rfc: cliente?.rfc,
        ...cliente?.domicilios_cliente[0],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cliente]);

  const onFinish = (values) => {
    console.log(values.cantidad);
    console.log(
      products.reduce(
        (total, product) =>
          total +
          calcPrecioVariable(product, nivel) * product.cantidad -
          calcPrecioVariable(product, nivel) *
            product.cantidad *
            toPercent(product.descuento),
        0
      )
    );

    if (
      values.cantidad >=
      products.reduce(
        (total, product) =>
          total +
          calcPrecioVariable(product, nivel) *
            product.cantidad *
            toPercent(100 - product.descuento) *
            toPercent(100 + product.iva),
        0
      )
    ) {
      onOk({
        ...values,
        cambio:
          cantidadRecibida -
          products.reduce(
            (total, product) =>
              total +
              calcPrecioVariable(product, nivel) *
                product.cantidad *
                toPercent(100 - product.descuento) *
                toPercent(100 + product.iva),
            0
          ),
      });
    } else {
      message.warning('Cantidad recibida incorrecta.');
    }
  };

  return (
    <Modal
      title='Método de pago'
      visible={visible}
      onOk={() => {
        form.submit();
      }}
      onCancel={onCancel}
      style={{ width: '80%' }}
      okText='Pagar'
      cancelText='Regresar'
      okButtonProps={{ disabled: buttonDisabled }}
      forceRender
    >
      <Form
        name='punto_venta'
        form={form}
        layout='vertical'
        onFinish={onFinish}
        onFieldsChange={() =>
          setButtonDisabled(
            form.getFieldsError().some((field) => field.errors.length > 0)
          )
        }
      >
        <Collapse accordion defaultActiveKey='1'>
          {tipoComprobante === 'factura' ? (
            <Collapse.Panel header='Factura' key='3'>
              <Form.Item
                name='cfdi'
                label='CFDI'
                rules={[
                  {
                    required: true,
                    message: 'Llenar una categoría',
                  },
                ]}
              >
                <Select
                  placeholder='Agrega CFDI'
                  //value={selectedItems}
                  //onChange={handleChangeItems}
                  style={{ width: '100%' }}
                >
                  {Object.keys(usosCfdi).map((item) => {
                    return (
                      <Option value={item} key={item}>
                        {usosCfdi[item]}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name='razon_social'
                label='Razón Social'
                rules={calleRules}
              >
                <Input maxLength={100} />
              </Form.Item>
              <Form.Item
                name='rfc'
                label='RFC'
                rules={[
                  {
                    required: true,
                    message: 'Requerido',
                  },
                  {
                    pattern:
                      '[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]',
                    message: 'Ingrese un RFC válido.',
                  },
                ]}
              >
                <Input maxLength={13} />
              </Form.Item>
              <Form.Item
                name='correo'
                label='Correo Electrónico'
                rules={[{ type: 'email', required: true }]}
              >
                <Input maxLength={100} />
              </Form.Item>
              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item name='calle' label='Calle' rules={calleRules}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name='no_ext' label='No. Ext.' rules={noExtRules}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name='no_int' label='No. Int.' rules={noIntRules}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name='cp' label='Código Postal' rules={cpRules}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name='entre_calle_1'
                    label='Entre calle 1'
                    rules={entreCalleRules}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name='entre_calle_2'
                    label='Entre calle 2'
                    rules={entreCalleRules}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name='colonia'
                    label='Colonia'
                    rules={coloniaRules}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name='localidad'
                    label='Localidad'
                    rules={localidadRules}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name='municipio'
                    label='Municipio'
                    rules={municipioRules}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name='estado' label='Estado' rules={estadoRules}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name='pais' label='País' rules={paisRules}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Collapse.Panel>
          ) : null}
          {metodoPago === '01' ? (
            <Collapse.Panel header='Pago en efectivo' key='2'>
              <Form.Item
                name='cantidad'
                label='Cantidad recibida'
                rules={[
                  {
                    required: true,
                    message: 'Falta ingresar cantidad',
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  onChange={setCantidadRecibida}
                />
              </Form.Item>
              <Form.Item label='Cambio'>
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => formatPrice(value)}
                  parser={(value) => formatPrice(value)}
                  readOnly
                  min={0}
                  value={
                    products && cantidadRecibida
                      ? cantidadRecibida -
                        products.reduce(
                          (total, product) =>
                            total +
                            calcPrecioVariable(product, nivel) *
                              product.cantidad *
                              toPercent(100 - product.descuento) *
                              toPercent(100 + product.iva),
                          0
                        )
                      : 0
                  }
                />
              </Form.Item>
            </Collapse.Panel>
          ) : (
            <Collapse.Panel
              header='Pago con tarjeta de débito o crédito'
              key='1'
            >
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
            </Collapse.Panel>
          )}
        </Collapse>
      </Form>
    </Modal>
  );
};

export default MetodoPagoModal;
