import { useState } from 'react';
import './styles.css';
import { List, Typography, Button, Badge, Select, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import CompraForm from 'components/forms/CompraForm';

const { Title, Text } = Typography;
const { Option } = Select;

const Index = ({ list }) => {
  list = [
    {
      no_compra: '1',
      rfc_proveedor: 'HDM001017AS1',
      nombre_proveedor: 'HOME DEPOT MEXICO S. DE R.L. DE C.V.',
      folio: '',
      fecha_compra: '2021-02-20T20:08:27',
      fecha_entrega: '2021-03-23T20:08:27',
      moneda: '',
      tipo_cambio: '',
      subtotal: '',
      total: '',
      forma_pago: '',
      metodo_pago: '',
    },
    {
      no_compra: '2',
      rfc_proveedor: 'CFE000814QH8',
      nombre_proveedor: 'EL CLAVO FERRETERIA S.A. DE C.V.',
      folio: '',
      fecha_compra: '2021-02-20T16:10:16',
      fecha_entrega: '2021-02-21T16:10:16',
      moneda: '',
      tipo_cambio: '',
      subtotal: '',
      total: '',
      forma_pago: '',
      metodo_pago: '',
    },
    {
      no_compra: '3',
      rfc_proveedor: 'SSC840823JT3',
      nombre_proveedor: 'SISTEMAS Y SERVICIOS DE COMUNICACION, S.A. DE C.V.',
      folio: '',
      fecha_compra: '2021-02-17T16:06:46',
      fecha_entrega: '2021-02-18T16:06:46',
      moneda: '',
      tipo_cambio: '',
      subtotal: '',
      total: '',
      forma_pago: '',
      metodo_pago: '',
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listElement, setListElement] = useState({});
  const [listToShow, setListToShow] = useState(list);

  const showModal = (listElement) => {
    setIsModalVisible(true);
    setListElement(listElement);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function onChange(value) {
    if (value === undefined) setListToShow(list);
    else
      setListToShow(
        list.filter((item) => item.rfc_proveedor.includes(value.toUpperCase()))
      );
  }

  function onSearch(value) {
    setListToShow(
      list.filter((item) =>
        item.nombre_proveedor.toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  function handleSort(value) {
    switch (value) {
      case 'reciente':
        setListToShow(list.slice().sort((a, b) => a.no_compra - b.no_compra));
        break;
      case 'antigua':
        setListToShow(list.slice().sort((a, b) => b.no_compra - a.no_compra));
        break;
      default:
        break;
    }
  }

  return (
    <>
      <Title level={2}>Compras</Title>
      <Row gutter={[16, 12]}>
        <Col xs={24} lg={12}>
          <Select
            allowClear
            showSearch
            style={{ width: '100%' }}
            placeholder='Buscar por proveedor'
            autoClearSearchValue={false}
            onSearch={onSearch}
            onChange={onChange}
            filterOption={(input, option) => {
              return option.children
                .toLowerCase()
                .includes(input.toLowerCase());
            }}
          >
            <Option value='HDM001017AS1'>
              HOME DEPOT MEXICO S. DE R.L. DE C.V.
            </Option>
            <Option value='CFE000814QH8'>
              EL CLAVO FERRETERIA S.A. DE C.V.
            </Option>
            <Option value='SSC840823JT3'>
              SISTEMAS Y SERVICIOS DE COMUNICACION, S.A. DE C.V.
            </Option>
          </Select>
        </Col>
        <Col>
          <Text
            style={{
              verticalAlign: 'sub',
            }}
          >
            Ordenar por:
          </Text>
        </Col>
        <Col flex={1}>
          <Select
            defaultValue='reciente'
            style={{ width: '100%' }}
            onChange={handleSort}
          >
            <Option value='reciente'>Más reciente</Option>
            <Option value='antigua'>Más antiguas</Option>
          </Select>
        </Col>
      </Row>
      <br />

      <List
        itemLayout='vertical'
        size='default'
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        dataSource={listToShow}
        renderItem={(item) => (
          <Badge.Ribbon text={item.fecha_entrega}>
            <List.Item key={item.no_compra}>
              <List.Item.Meta
                title={
                  <p
                    onClick={() => {
                      showModal(item);
                    }}
                    style={{
                      cursor: 'pointer',
                      margin: 0,
                    }}
                  >
                    {item.nombre_proveedor}
                  </p>
                }
                description={`Comprado el ${item.fecha_compra}`}
              />
              {`RFC: ${item.rfc_proveedor}`}
            </List.Item>
          </Badge.Ribbon>
        )}
      />
      <br />
      <Link to='/compras/registrar'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Compra
        </Button>
      </Link>
      <Modal
        title={listElement.nombre_proveedor}
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <CompraForm
          // onSubmit={compraActualizada}
          submitText='Guardar cambios'
          datosCompra={listElement}
        />
      </Modal>
    </>
  );
};

export default Index;
