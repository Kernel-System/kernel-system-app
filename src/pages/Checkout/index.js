import {
  DollarOutlined,
  LikeOutlined,
  NodeIndexOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Button,
  Col,
  Divider,
  Image,
  message,
  Row,
  Steps,
  Tabs,
  Typography,
} from 'antd';
import LoginForm from 'components/auth/Login/LoginForm';
import AddressCard from 'components/shared/AddressCard';
import BoughtProductsList from 'components/shared/BoughtProductsList';
import Heading from 'components/UI/Heading';
import TextLabel from 'components/UI/TextLabel';
import { useEffect, useState } from 'react';
import { formatPrice } from 'utils';
const { Title, Paragraph } = Typography;

// TEMPORAL
const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];

const Checkout = () => {
  const [step, setStep] = useState(0);
  const [isAuth] = useState(false);

  useEffect(() => {
    if (isAuth) {
      setStep(1);
    }
  }, [isAuth]);

  const next = () => {
    setStep(step + 1);
  };

  const prev = () => {
    setStep(step - 1);
  };

  return (
    <>
      <Steps current={step} style={{ marginBottom: '1em' }}>
        <Steps.Step title='Autenticación' icon={<UserOutlined />} />
        <Steps.Step title='Dirección' icon={<NodeIndexOutlined />} />
        <Steps.Step title='Facturación' icon={<SolutionOutlined />} />
        <Steps.Step title='Pago' icon={<DollarOutlined />} />
        <Steps.Step title='¡Gracias por tu compra!' icon={<LikeOutlined />} />
      </Steps>
      <br />
      <Tabs
        activeKey={step.toString()}
        defaultActiveKey={step.toString()}
        tabBarStyle={{ display: 'none' }}
      >
        <Tabs.TabPane key='0'>
          <LoginForm />
        </Tabs.TabPane>
        <Tabs.TabPane key='1'>
          <Heading title='Selecciona una dirección de envío' />
          <Title level={5}>Dirección de envío por defecto</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={8}>
              <AddressCard />
            </Col>
          </Row>
          <Divider />
          <Title level={5}>Otras direcciones</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12} lg={8}>
              <AddressCard />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <AddressCard />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <AddressCard />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <AddressCard />
            </Col>
            <Col xs={24} md={12} lg={8}>
              <AddressCard nueva />
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane key='2'>Lo mismo que la 2</Tabs.TabPane>
        <Tabs.TabPane key='3'>
          <Heading
            title='Ingrese su información de pago'
            subtitle='Para su comodidad contamos con dos cuentas de depósito para el pago de sus productos.'
          />
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Image width={400} height={200} preview={false} />
              <Alert
                message='Nota'
                description={
                  <>
                    <Paragraph>
                      Una vez realizado su pago por favor envíenos una
                      fotografía de su ticket al correo kernelsystems@gmail.com,
                      nosotros nos contactaremos con usted por correo
                      electrónico para confirmar su pedido.
                    </Paragraph>
                    <Paragraph>
                      Nota: Los pagos pueden tomar hasta 24 horas en
                      acreditarse.
                    </Paragraph>
                  </>
                }
                type='info'
                showIcon
              />
            </Col>
            <Col xs={24} lg={8}>
              SUMMARY
            </Col>
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane key='4'>
          <Heading title='Gracias, has realizado tu pedido' />
          <Row>
            <Col xs={24} md={12}>
              <TextLabel title='Número de pedido' description='1237578' />
              <TextLabel
                title='Factura electrónica (CFDI)'
                description='Tendrás 24 horas después de realizar tu pedido para solicitar tu
                factura electrónica (CFDI) a través de “Mis pedidos”.'
              />
              <TextLabel title='Total' description={formatPrice(420)} />
              <TextLabel title='Productos adquiridos' />
              <BoughtProductsList data={data} />
            </Col>
            <Col
              xs={24}
              md={12}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image width={320} height={320} preview={false} />
            </Col>
          </Row>
        </Tabs.TabPane>
      </Tabs>
      <Divider />
      {step < 5 - 1 && (
        <Button type='primary' onClick={() => next()}>
          Continuar
        </Button>
      )}
      {step === 5 - 1 && (
        <Button
          type='primary'
          onClick={() => message.success('Processing complete!')}
        >
          Done
        </Button>
      )}
      {step > 0 && (
        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
          Atras
        </Button>
      )}
    </>
  );
};

export default Checkout;
