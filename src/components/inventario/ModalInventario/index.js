import { Modal, Select, Table } from 'antd';
import TextLabel from 'components/UI/TextLabel';
import { useEffect, useState } from 'react';

const { Option } = Select;

const Index = ({ visible, inventario, alm, hideModal }) => {
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [series, setSeries] = useState([]);

  const onSetDato = (dato, setDato) => {
    console.log(dato);
    setDato(dato);
  };

  useEffect(() => {
    if (alm === 'Todo') {
      onSetDato(
        inventario?.map((dato) => dato.cantidad)?.reduce((a, b) => a + b, 0),
        setCantidad
      );
      onSetDato(
        inventario?.map((inv) => {
          return {
            descripcion: inv.codigo_producto.descripcion,
            series: inv.series_inventario,
            almacen: inv.clave_almacen,
            cantidad: inv.cantidad,
            id: inv.id,
          };
        }),
        setSeries
      );
      onSetDato(inventario[0]?.codigo_producto?.titulo, setProducto);
    } else {
      onSetDato(inventario?.cantidad, setCantidad);
      onSetDato(
        [
          {
            descripcion: inventario?.codigo_producto?.descripcion,
            imagen:
              inventario?.codigo_producto?.imagenes?.length !== 0
                ? `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${inventario?.codigo_producto?.imagenes[0].directus_files_id}`
                : '',
            series: inventario?.series_inventario,
            almacen: inventario?.clave_almacen,
            cantidad: inventario?.cantidad,
            id: inventario?.id,
          },
        ],
        setSeries
      );
      onSetDato(inventario?.codigo_producto?.titulo, setProducto);
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
          return null;
        }
      },
    },
  ];

  return (
    <>
      <Modal
        title={`Producto: ${producto}`}
        centered
        visible={visible}
        onCancel={hideModal}
        width={'85%'}
        footer={null}
      >
        <TextLabel title='Cantidad Total' subtitle={cantidad} />
        <TextLabel title='Productos con series' />
        <Table
          columnWidth='10px'
          bordered
          scroll={{ x: 1000, y: 600 }}
          dataSource={series}
          columns={columns}
          rowClassName='editable-row'
          /*pagination={{
          onChange: cancel,
        }}*/
        />
      </Modal>
    </>
  );
};

//        <BoughtProductsListWithSeries products={series} />

//

export default Index;
