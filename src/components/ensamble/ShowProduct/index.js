import { InputNumber, Input, Typography, Space, Row, Col } from 'antd';
import { useState } from 'react';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
const { Title } = Typography;

const Index = ({ filas, titulo, onChanged, onEdition, estado }) => {
  const breakpoint = useBreakpoint();
  const [longitud] = useState(filas.length);

  const changeSerie = (fila, value, indice, actual) => {
    if (value.split(' ').join('') !== '') {
      const lista = JSON.parse(JSON.stringify(fila));
      lista.series_componentes_ensamble[actual] = {
        ...lista.series_componentes_ensamble[actual],
        serie: value,
        componente_ensamble: lista.id,
      };
      //console.log(lista.series[actual])
      onChanged(
        { ...lista.series_componentes_ensamble[actual] },
        indice,
        actual
      );
    }
  };

  const inputs = (fila, numero, indice) => {
    const arreglo = Array.from(Array(numero).keys());
    const numeros = arreglo.map((actual) => {
      return (
        <InputNumber
          key={`${fila.id}${actual}`}
          placeholder='Número de Serie'
          style={{ width: '100%' }}
          disabled={
            fila.series_componentes_ensamble.length === 0
              ? estado === 'Ordenado'
                ? false
                : true
              : onEdition
          }
          min={1}
          defaultValue={
            fila.series_componentes_ensamble !== 0
              ? fila.series_componentes_ensamble[actual] !== undefined
                ? fila.series_componentes_ensamble[actual].serie
                : ''
              : ''
          }
          onBlur={(e) => {
            changeSerie(fila, e.target.value, indice, actual);
          }}
        />
      );
    });
    return numeros;
  };
  return longitud !== 0 ? (
    <div style={{ marginBottom: '20px', marginTop: '20px' }}>
      <Title level={4}>{`${titulo}`}</Title>
      {filas.map((fila, indice) => {
        return (
          <Row
            key={`${fila.id}${indice}`}
            gutter={[16, 24]}
            style={{ marginBottom: '10px' }}
          >
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
        );
      })}
    </div>
  ) : (
    <div></div>
  );
};

export default Index;
