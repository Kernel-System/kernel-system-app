import { Avatar, List, Select } from 'antd';
const { Option } = Select;

const BoughtProductsList = ({ products }) => {
  return (
    <List
      dataSource={products}
      split={false}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              item?.imagenes?.length !== 0 ? (
                <Avatar
                  shape='square'
                  src={`${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${item.imagenes[0].directus_files_id}`}
                />
              ) : null
            }
            title={item.titulo}
            description={`Cantidad: ${item.cantidad}`}
          />
          {item?.series_producto_movimiento?.length !== 0 ? (
            <Select style={{ width: '40%' }} optionFilterProp='children'>
              {item.series_producto_movimiento.map((serie) => (
                <Option key={serie.id} value={serie.id}>
                  {serie.serie}
                </Option>
              ))}
            </Select>
          ) : null}
        </List.Item>
      )}
    />
  );
};

export default BoughtProductsList;
