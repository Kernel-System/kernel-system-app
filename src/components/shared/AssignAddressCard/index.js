import { Button, Card, Modal, Select, Typography } from 'antd';
import { useState } from 'react';
const { Text } = Typography;

const AssignAddressCard = ({ tipo }) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Card
        size='small'
        title={`Dirección de ${tipo} por defecto`}
        extra={
          <Button type='link' onClick={showModal}>
            Asignar
          </Button>
        }
      >
        <Text>No ha asignado una dirección de {tipo} por defecto</Text>
      </Card>
      <Modal
        title={`Asignar dirección de ${tipo} por defecto`}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Select defaultValue='lucy' style={{ width: '100%' }}>
          <Select.Option value='lucy'>Lucy</Select.Option>
        </Select>
      </Modal>
    </>
  );
};

export default AssignAddressCard;
