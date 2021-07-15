import './styles.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { List, Select, Button, Row, Col, Typography, Grid, Badge } from 'antd';
import { EyeFilled, EditFilled } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { http } from 'api';
import { contentCol } from 'utils/gridUtils';
import moment from 'moment';

const { Option } = Select;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const formatoFecha = 'DD MMMM YYYY, hh:mm:ss a';
const formatoSinHora = 'DD MMMM YYYY';

const Index = ({ putToken }) => {
  const fetchProducts = async () => {
    const { data } = await http.get(
      `/items/ordenes_ensamble?fields=folio,fecha_orden,estado,descripcion,fecha_fin_ensamble,fecha_inicio_ensamble`,
      putToken
    );
    return data.data;
  };

  const onSearchChange = (value) => {
    setSearchValue(value);
    filtrarEnsamblesPorEstado(data, value);
  };

  const filtrarEnsamblesPorEstado = async (ensambles, value) => {
    // console.log(value);
    if (value === 'Todo') {
      setListToShow(ensambles);
    } else if (ensambles)
      setListToShow(ensambles.filter((item) => item.estado.includes(value)));
  };

  const [searchValue, setSearchValue] = useState('');

  const { data } = useQuery('ensambles', async () => {
    const result = await fetchProducts();
    setListToShow(result);
    filtrarEnsamblesPorEstado(result, searchValue);
    return result;
  });
  const [listToShow, setListToShow] = useState([]);

  const screen = useBreakpoint();

  return (
    <>
      <Row gutter={[10, 12]} style={{ marginBottom: 10 }}>
        <Col>
          <Text
            style={{
              verticalAlign: 'sub',
            }}
          >
            Ordenar por Estado:
          </Text>
        </Col>
        <Col {...contentCol(screen, 'auto')}>
          <Select
            defaultValue='Todo'
            style={{ width: '100%' }}
            onChange={onSearchChange}
          >
            <Option value='Todo'>Todo</Option>
            <Option value='Ordenado'>Ordenado</Option>
            <Option value='En ensamble'>En ensamble</Option>
            <Option value='Ensamblado'>Ensamblado</Option>
            <Option value='Ingresado en almacén'>Ingresado en almacén</Option>
          </Select>
        </Col>
      </Row>
      <br />
      <List
        itemLayout='horizontal'
        size='default'
        pagination={{
          onChange: (page) => {
            //changePag(page);
          },
          pageSize: 5,
        }}
        dataSource={listToShow}
        renderItem={(item, index) => (
          <Badge.Ribbon
            key={index}
            style={{
              top: -12,
            }}
            text={
              item.fecha_fin_ensamble ? (
                <>
                  <b>Finalizado: </b>
                  {moment(item.fecha_fin_ensamble).format(formatoSinHora)}
                </>
              ) : item.fecha_inicio_ensamble ? (
                <>
                  <b>Iniciado: </b>
                  {moment(item.fecha_inicio_ensamble).format(formatoSinHora)}
                </>
              ) : (
                'Ensamble sin iniciar'
              )
            }
          >
            <List.Item
              key={item.folio}
              actions={[
                <Link to={`/ensambles/${item.folio}`}>
                  <Button
                    icon={
                      item.estado === 'Ingresado en almacén' ? (
                        <EyeFilled />
                      ) : (
                        <EditFilled />
                      )
                    }
                  ></Button>
                </Link>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Link to={`/ensambles/${item.folio}`}>
                    <p
                      style={{
                        cursor: 'pointer',
                        margin: 0,
                      }}
                    >
                      {`Folio ${item.folio} - ${item.descripcion}`}
                    </p>
                  </Link>
                }
                description={`Ordenado el ${moment(
                  new Date(item.fecha_orden)
                ).format(formatoFecha)}`}
              />
              {
                <span
                  style={{
                    display: 'inline',
                    opacity: 0.8,
                  }}
                >
                  <b>{item.estado}</b>
                </span>
              }
            </List.Item>
          </Badge.Ribbon>
        )}
      />
    </>
  );
};

export default Index;
