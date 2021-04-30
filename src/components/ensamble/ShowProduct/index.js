import { Input, Typography, Row, Col } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
const { Title } = Typography;

const Index = ({ titulo, elementosLista, puesto }) => {
  const breakpoint = useBreakpoint();

  return (
    <div style={{ marginBottom: '20px' }}>
      <Title level={4}>{titulo}</Title>
      {elementosLista.map((elemento) => (
        <Row gutter={[16, 24]} style={{ marginBottom: '10px' }}>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <Input
              placeholder='Número de Serie'
              style={{ width: '100%' }}
              key={elemento.codigo}
              value={elemento.descripcion}
              disabled={true}
            />
          </Col>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <Input
              placeholder='Número de Serie'
              style={{ width: '100%' }}
              disabled={false}
              onBlur={() => {}}
            />
          </Col>
        </Row>
      ))}
    </div>
  );
};

export default Index;
