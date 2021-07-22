import { Modal, Select, Table, Col, Row } from 'antd';
import TextLabel from 'components/UI/TextLabel';
import { useEffect, useState } from 'react';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
const { Option } = Select;

const Index = ({ visible, venta, hideModal }) => {
  const [productos, setProductos] = useState([]);
  const [productosVentas, setProductosVentas] = useState([]);

  const breakpoint = useBreakpoint();

  const onSetDato = (dato, setDato) => {
    setDato(dato);
  };

  useEffect(() => {
    let productosIngresar = [];
    let productosVentas = [];
    venta?.movimientos_almacen?.forEach((movimiento) => {
      movimiento?.productos_movimiento.forEach((producto) => {
        productosIngresar.push({
          key: producto.id,
          id: producto.id,
          descripcion: producto.titulo,
          codigo: producto.codigo,
          almacen: movimiento.clave_almacen,
          cantidad: producto.cantidad,
          series: producto.series_producto_movimiento,
        });
      });
    });
    venta?.productos_venta?.forEach((producto) => {
      productosVentas.push({
        key: producto.id,
        id: producto.id,
        descripcion: producto.descripcion,
        codigo: producto.codigo,
        cantidad: producto.cantidad,
        cantidad_entregada: producto.cantidad_entregada,
        total: '$' + (producto.importe - producto.descuento + producto.iva),
        series: producto.series_producto_venta,
      });
    });
    onSetDato(productosIngresar, setProductos);
    onSetDato(productosVentas, setProductosVentas);
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
      width: 100,
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
              style={{ width: '100%' }}
              placeholder='Serie'
              optionFilterProp='children'
            >
              {record?.series?.map((serie, indx) => (
                <Option key={indx} value={serie}>
                  {serie}
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

  const columnsVentas = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 50,
    },
    {
      title: 'Cod.',
      dataIndex: 'codigo',
      width: 100,
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      width: 100,
    },
    {
      title: 'Cantidad Entregada',
      dataIndex: 'cantidad_entregada',
      width: 100,
    },
    {
      title: 'Total',
      dataIndex: 'total',
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
              style={{ width: '100%' }}
              placeholder='Serie'
              optionFilterProp='children'
            >
              {record?.series?.map((serie, indx) => (
                <Option key={indx} value={serie}>
                  {serie}
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
            <TextLabel title='IVA' subtitle={`$ ${venta.iva}`} />
          </Col>
          <Col span={breakpoint.lg ? 6 : 24}>
            <TextLabel title='Total' subtitle={`$ ${venta.total}`} />
          </Col>
        </Row>
        {venta?.factura?.length !== 0 && venta?.factura !== undefined ? (
          <TextLabel title='Factura' subtitle={`${venta.factura.toString()}`} />
        ) : null}
        {venta.facturas_globales !== null ? (
          <TextLabel
            title='Factura Global'
            subtitle={`${venta.facturas_globales}`}
          />
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
        <TextLabel title='Productos de venta' />
        <Table
          key='1'
          columnWidth='10px'
          bordered
          //   scroll={{ x: 1000, y: 600 }}
          dataSource={productosVentas}
          columns={columnsVentas}
          rowClassName='editable-row'
          /*pagination={{
          onChange: cancel,
        }}*/
        />
        {productos.length !== 0 ? (
          <div>
            <TextLabel title='Movimientos Realizados' />
            <Table
              key='2'
              columnWidth='10px'
              bordered
              //   scroll={{ x: 1000, y: 600 }}
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
