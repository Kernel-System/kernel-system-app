import { Modal, Select, Table, Col, Row } from 'antd';
import TextLabel from 'components/UI/TextLabel';
import { useEffect, useState } from 'react';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
const { Option } = Select;

const Index = ({ visible, venta, hideModal }) => {
  const [productos, setProductos] = useState([]);
  const breakpoint = useBreakpoint();

  const onSetDato = (dato, setDato) => {
    setDato(dato);
  };

  useEffect(() => {
    console.log(venta?.id_cliente);
    let productosIngresar = [];
    venta?.movimientos_almacen?.forEach((movimiento) => {
      movimiento?.productos_movimiento.forEach((producto) => {
        productosIngresar.push({
          id: producto.id,
          descripcion: producto.codigo_producto.descripcion,
          codigo: producto.codigo,
          almacen: movimiento.clave_almacen,
          cantidad: producto.cantidad,
          series: producto.series_producto_movimiento,
        });
      });
    });
    onSetDato(productosIngresar, setProductos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venta]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 50,
    },
    {
      title: 'Cod.',
      dataIndex: 'codigo',
      width: 50,
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
    },
    {
      title: 'Almacén',
      dataIndex: 'almacen',
      width: 100,
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      width: 100,
    },
    {
      title: 'Series',
      dataIndex: 'series',
      width: 250,
      render: (_, record) => {
        if (record.series.length !== 0) {
          return (
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder='Concepto'
              optionFilterProp='children'
            >
              {record?.series?.map((serie, indx) => (
                <Option key={indx} value={serie.id}>
                  {serie.serie}
                </Option>
              ))}
            </Select>
          );
        } else {
          return null;
        }
      },
    },
  ];

  return (
    <>
      <Modal
        title={`Venta: ${venta.no_venta}`}
        centered
        visible={visible}
        onCancel={hideModal}
        width={'85%'}
        footer={null}
      >
        <Row gutter={[16, 16]}>
          <Col span={breakpoint.lg ? 6 : 24}>
            <TextLabel title='Subtotal' subtitle={`$ ${venta.subtotal}`} />
          </Col>
          <Col span={breakpoint.lg ? 6 : 24}>
            <TextLabel title='Descuento' subtitle={`$ ${venta.descuento}`} />
          </Col>
          <Col span={breakpoint.lg ? 6 : 24}>
            <TextLabel title='IVA' subtitle={`$ ${venta.descuento}`} />
          </Col>
          <Col span={breakpoint.lg ? 6 : 24}>
            <TextLabel title='Total' subtitle={`$ ${venta.total}`} />
          </Col>
        </Row>
        {venta.factura !== null ? (
          <TextLabel title='Factura' subtitle={`${venta.factura}`} />
        ) : null}
        {venta?.id_cliente !== null ? (
          <TextLabel title='Cliente' subtitle={`${venta?.id_cliente?.rfc}`} />
        ) : null}
        <TextLabel
          title='Vendedor'
          subtitle={`${venta?.rfc_vendedor?.nombre}`}
        />
        <TextLabel
          title='Sucursal'
          subtitle={`${venta?.rfc_vendedor?.sucursal}`}
        />
        {productos.length !== 0 ? (
          <div>
            <TextLabel title='Productos con series' />
            <Table
              columnWidth='10px'
              bordered
              scroll={{ x: 1000, y: 600 }}
              dataSource={productos}
              columns={columns}
              rowClassName='editable-row'
              /*pagination={{
          onChange: cancel,
        }}*/
            />
          </div>
        ) : null}
      </Modal>
    </>
  );
};

//        <BoughtProductsListWithSeries products={series} />

//

export default Index;
