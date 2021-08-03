import { Table, Popconfirm, Input, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { estadoProductoRMA } from 'utils/almacen';

const TablaProductosRMA = ({ productos, setProductos, desabilitarEstado }) => {
  const onChangeSerie = (serie, key) => {
    const newData = productos.slice();
    const elem = newData.find((data) => data.key === key);
    elem.serie = serie;
    setProductos(newData);
  };

  const onChangeProblema = (problema, key) => {
    const newData = productos.slice();
    const elem = newData.find((data) => data.key === key);
    elem.problema = problema;
    setProductos(newData);
  };

  const onChangeEstado = (estado, key) => {
    const newData = productos.slice();
    const elem = newData.find((data) => data.key === key);
    elem.estado = estado;
    console.log({ estado });
    console.log({ elem });
    setProductos(newData);
  };

  const handleDelete = (key) => {
    const newProducts = [...productos];
    setProductos(newProducts.filter((item) => item.key !== key));
  };

  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigo',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      ellipsis: true,
      render: (text, record) => <div style={{ width: '400px' }}>{text}</div>,
    },
    {
      title: 'Serie',
      dataIndex: 'serie',
      editable: true,
      render: (serie, record) => {
        return (
          <Input
            onChange={(e) => {
              const newVal = e.target.value;
              onChangeSerie(newVal, record.key);
            }}
            value={serie}
          />
        );
      },
    },
    {
      title: 'Problema',
      dataIndex: 'problema',
      editable: true,
      render: (problema, record) => {
        return (
          <Input
            onChange={(e) => {
              const newVal = e.target.value;
              onChangeProblema(newVal, record.key);
            }}
            value={problema}
          />
        );
      },
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      ellipsis: true,
      width: '240px',
      render: (estado, record) => {
        return (
          <Select
            value={estado}
            style={{ width: '100%' }}
            placeholder='Estado del producto'
            onChange={(value) => {
              onChangeEstado(value, record.key);
            }}
            disabled={desabilitarEstado}
          >
            {Object.keys(estadoProductoRMA).map((estadoProducto, indx) => {
              return (
                <Select.Option key={indx} value={estadoProducto}>
                  {estadoProductoRMA[estadoProducto]}
                </Select.Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: '',
      dataIndex: 'operation',
      width: '50px',
      render: (_, record) => {
        return (
          <Popconfirm
            title='¿Estas seguro de querer eliminar?'
            onConfirm={() => handleDelete(record.key)}
          >
            <DeleteOutlined />
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={productos}
      pagination={false}
      style={{ marginBottom: '1.714em' }}
      scroll={{ x: true }}
      bordered
      columns={columns}
      rowClassName='editable-row'
    ></Table>
  );
};

export default TablaProductosRMA;
