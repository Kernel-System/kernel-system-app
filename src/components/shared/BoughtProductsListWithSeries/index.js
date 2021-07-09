import { Collapse } from 'antd';

const { Panel } = Collapse;

const BoughtProductsListWithSeries = ({ products }) => {
  //           avatar={
  //             item?.imagenes?.length !== 0 ? (
  //               <Avatar
  //                 shape='square'
  //                 src={
  //                   item.imagenes.length
  //                     ? `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${item.imagenes[0].directus_files_id}`
  //                     : undefined
  //                 }
  //               />
  //             ) : null
  //           }

  //   console.log({ products });

  return (
    <Collapse ghost>
      {products?.map((item, index) => {
        return (
          <Panel
            header={<b style={{ opacity: 0.7 }}>{`${item.titulo}`}</b>}
            key={index}
            extra={
              <>
                {'Cantidad: '}
                <b style={{ opacity: 0.7 }}>{item.cantidad}</b>
              </>
            }
          >
            {item.series_producto_movimiento?.length ? (
              <ul>
                {item.series_producto_movimiento.map((serie) => (
                  <li key={serie.id} value={serie.id}>
                    {serie.serie}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Producto sin series</p>
            )}
          </Panel>
        );
      })}
    </Collapse>
  );
};

export default BoughtProductsListWithSeries;
