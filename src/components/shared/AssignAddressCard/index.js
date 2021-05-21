import { Button, Card, Modal, Select, Typography } from 'antd';
import { useState } from 'react';
const { Text } = Typography;

const AssignAddressCard = ({ tipo, addresses }) => {
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
        <Select style={{ width: '100%' }}>
          {addresses?.data?.data.map((address) => (
            <Select.Option key={address.id} value={address.id}>
              {address.calle} {address.no_ext}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default AssignAddressCard;
