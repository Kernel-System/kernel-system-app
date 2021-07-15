import { Modal, List } from 'antd';
import { useEffect } from 'react';

const Index = ({ lista, onSelection, visible, clave, setVis }) => {
  useEffect(() => {
    // Buscar con clave
  }, []);

  return (
    <>
      <Modal
        title={`Seleccione un producto`}
        centered
        visible={visible}
        onOk={() => {
          setVis();
        }}
        onCancel={() => {
          setVis();
        }}
        width={'50%'}
        footer={null}
      >
        <List
          itemLayout='horizontal'
          size='default'
          pagination={{
            onChange: (page) => {
              //changePag(page);
            },
            pageSize: 8,
          }}
          dataSource={lista}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                //avatar={<Avatar src={item.avatar} />}
                title={
                  <p
                    onClick={() => {
                      onSelection(item);
                      setVis();
                    }}
                    style={{
                      cursor: 'pointer',
                      margin: 0,
                    }}
                  >
                    {item.descripcion}
                  </p>
                }
                description={'$' + item.valor_unitario}
              />
              <span
                onClick={() => {
                  onSelection(item);
                  setVis();
                }}
                style={{
                  display: 'inline',
                  cursor: 'pointer',
                }}
              >
                Clave:{' '}
                <b
                  style={{
                    opacity: 1,
                  }}
                >
                  {item.clave}
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
