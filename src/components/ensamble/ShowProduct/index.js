import { Input, Typography, Space, Row, Col } from 'antd';
import { useState } from 'react';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
const { Title } = Typography;

const Index = ({ filas, titulo, tag, onChanged }) => {
  const breakpoint = useBreakpoint();
  const [longitud] = useState(filas.length);

  const changeSerie = (fila, value, tag, indice, actual) => {
    if (value.split(' ').join('') !== '') {
      const lista = JSON.parse(JSON.stringify(fila));
      lista.series[actual] = { ...lista.series[actual], serie: value };
      //console.log(lista.series[actual])
      onChanged({ ...lista.series[actual] }, tag, indice, actual);
    }
  };

  const inputs = (fila, numero, indice) => {
    const arreglo = Array.from(Array(numero).keys());
    const numeros = arreglo.map((actual) => {
      return (
        <Input
          key={`${fila.id}${actual}`}
          placeholder='Número de Serie'
          style={{ width: '100%' }}
          defaultValue={
            fila.series[actual] !== undefined ? fila.series[actual].serie : ''
          }
          onBlur={(e) => {
            changeSerie(fila, e.target.value, tag, indice, actual);
          }}
          disabled={false}
        />
      );
    });
    return numeros;
  };

  return longitud !== 0 ? (
    <div style={{ marginBottom: '20px', marginTop: '20px' }}>
      <Title level={4}>{`${titulo}`}</Title>
      {filas.map((fila, indice) => (
        <Row key={fila.id} gutter={[16, 24]} style={{ marginBottom: '10px' }}>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <Input
              placeholder='Producto'
              style={{ width: '100%' }}
              disabled={true}
              value={fila.descripcion}
            />
          </Col>
          <Col className='gutter-row' span={breakpoint.lg ? 12 : 24}>
            <Space direction='vertical' style={{ width: '100%' }}>
              {inputs(fila, fila.cantidad, indice)}
            </Space>
          </Col>
        </Row>
      ))}
    </div>
  ) : (
    <div></div>
  );
};

export default Index;
