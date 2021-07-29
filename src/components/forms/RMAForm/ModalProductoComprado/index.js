import { Modal, List } from 'antd';

const Index = ({ lista, onSelect, visible, hide }) => {
  return (
    <>
      <Modal
        title={`Seleccione un producto`}
        centered
        visible={visible}
        onOk={() => {
          hide();
        }}
        onCancel={() => {
          hide();
        }}
        width={'50%'}
        footer={null}
      >
        <List
          itemLayout='horizontal'
          size='default'
          pagination={{
            onChange: (page) => {},
            pageSize: 8,
          }}
          dataSource={lista}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                title={
                  <p
                    onClick={() => {
                      onSelect(item);
                      hide();
                    }}
                    style={{
                      cursor: 'pointer',
                      margin: 0,
                    }}
                  >
                    {item.codigo && `Código ${item.codigo} - `}
                    {item.descripcion}
                  </p>
                }
                description={`Clave: ${item.clave}`}
              />
              <span
                onClick={() => {
                  onSelect(item);
                  hide();
                }}
                style={{
                  display: 'inline',
                  cursor: 'pointer',
                }}
              >
                Código en catálogo:{' '}
                <b
                  style={{
                    opacity: 1,
                  }}
                >
                  {item.producto_catalogo ?? 'sin ligar a catálogo'}
                </b>
              </span>
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default Index;
