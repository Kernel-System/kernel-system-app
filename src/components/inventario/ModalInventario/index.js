import { Modal, Select, Table } from 'antd';
import TextLabel from 'components/UI/TextLabel';
import { useEffect, useState } from 'react';

const { Option } = Select;

const Index = ({ visible, inventario, hideModal }) => {
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    if (inventario && inventario.length) {
      setCantidad(
        inventario.map((dato) => dato.cantidad).reduce((a, b) => a + b, 0)
      );
      setSeries(
        inventario.map((inv, indx) => {
          return {
            key: indx,
            imagen: inv.codigo_producto.imagenes?.length
              ? `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${inv.codigo_producto.imagenes[0].directus_files_id}`
              : '',
            series: inv.series_inventario,
            almacen: inv.clave_almacen.clave,
            sucursal: inv.clave_almacen.clave_sucursal,
            cantidad: inv.cantidad,
            id: inv.id,
          };
        })
      );
      setProducto(inventario[0]?.codigo_producto?.titulo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventario]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 50,
    },
    {
      title: 'Almacén',
      dataIndex: 'almacen',
    },
    {
      title: 'Sucursal',
      dataIndex: 'sucursal',
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
    },
    {
      title: 'Series',
      dataIndex: 'series',
      width: 250,
      render: (_, record) => {
        if (record?.series?.length !== 0) {
          return (
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder='Series'
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
          return 'Producto sin series';
        }
      },
    },
  ];

  return (
    <>
      <Modal
        title={`${producto}`}
        centered
        visible={visible}
        onCancel={hideModal}
        width={'85%'}
        footer={null}
      >
        <TextLabel
          title='Descripción'
          subtitle={
            inventario.length && inventario[0].codigo_producto?.descripcion
          }
        />
        <TextLabel title='Cantidad Total' subtitle={cantidad} />
        <TextLabel title='Inventario' />
        <Table
          bordered
          dataSource={series}
          columns={columns}
          rowClassName='editable-row'
        />
      </Modal>
    </>
  );
};

export default Index;
