import { Table } from 'antd';
import Column from 'antd/lib/table/Column';
import { formatPrice } from 'utils/functions';

const ProductosTable = ({ productos }) => {
  return (
    <Table
      dataSource={productos}
      pagination={false}
      style={{ marginBottom: '1.714em' }}
      scroll={{ x: true }}
    >
      <Column title='Clave' key='clave' dataIndex='clave' />
      <Column title='Código' key='codigo' dataIndex='codigo' />
      <Column title='Descripción' key='descripcion' dataIndex='descripcion' />
      <Column title='Cantidad' key='cantidad' dataIndex='cantidad' />
      <Column title='Unidad' key='unidad' dataIndex='unidad' />
      <Column
        title='Descuento'
        key='descuento'
        dataIndex='descuento'
        // render={(valorUnitario) => formatPrice(valorUnitario)}
      />
      <Column
        title='Valor unitario'
        key='valor_unitario'
        dataIndex='valor_unitario'
        render={(valorUnitario) => formatPrice(valorUnitario)}
      />
      <Column
        title='Importe'
        key='importe'
        dataIndex='importe'
        render={(importe) => formatPrice(importe)}
      />
    </Table>
  );
};

export default ProductosTable;
