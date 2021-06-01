import { Modal, Button, List } from 'antd';
import TextLabel from 'components/UI/TextLabel';
import { useEffect } from 'react';

const Index = ({ lista, onSelection, visible, clave, setVis }) => {
  useEffect(() => {
    // Buscar con clave
  }, []);

  return (
    <>
      <Modal
        //title={`Ensamble No. ${clave}`}
        centered
        visible={visible}
        onOk={() => {
          setVis();
        }}
        onCancel={() => {
          setVis();
        }}
        width={'85%'}
        footer={[
          <Button
            key='submit'
            type='primary'
            onClick={() => {
              setVis();
            }}
          >
            Confirmar
          </Button>,
        ]}
      >
        <TextLabel title='Selecciona un producto.' />
        <List
          itemLayout='vertical'
          size='default'
          pagination={{
            onChange: (page) => {
              //changePag(page);
            },
            pageSize: 5,
          }}
          dataSource={lista}
          renderItem={(item) => (
            <List.Item key={item.codigo}>
              <List.Item.Meta
                //avatar={<Avatar src={item.avatar} />}
                onClick={() => {
                  onSelection(item);
                  setVis();
                }}
                title={`Codigo ${item.codigo}`}
                description={item.descripcion}
              />
              {item.titulo}
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default Index;
