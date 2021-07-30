import { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import RMAForm from 'components/forms/RMAForm';
import ListaRMAs from 'components/list/RMAList';
import * as CRUD from 'api/compras/rmas';
import { useStoreState } from 'easy-peasy';

const Index = (props) => {
  const showModal = (element) => {
    setIsModalVisible(true);
    setListElement(element);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onConfirmDelete = async (item) => {
    deleteMutation.mutate(item);
  };

  const onSaveChanges = (values) => {
    const newValues = {
      ...values,
      id: listElement.id,
    };
    updateMutation.mutate(newValues);
  };

  const token = useStoreState((state) => state.user.token.access_token);
  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    (values) => CRUD.updateItem(values, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rmas').then(() => {
          message.success('Cambios guardados exitosamente');
          setIsModalVisible(false);
        });
      },
    }
  );
  const deleteMutation = useMutation(
    (values) => CRUD.deleteItem(values, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rmas').then(() => {
          message.success('Registro eliminado exitosamente');
        });
      },
    }
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listElement, setListElement] = useState({});

  return (
    <>
      <ListaRMAs
        onClickItem={showModal}
        editItem={showModal}
        onConfirmDelete={onConfirmDelete}
      ></ListaRMAs>
      <br />

      <Link to='/rmas/registrar'>
        <Button type='primary' icon={<PlusOutlined />}>
          Registrar RMA
        </Button>
      </Link>
      {listElement && (
        <Modal
          title={`Folio: ${listElement.folio}`}
          visible={isModalVisible}
          footer={null}
          onCancel={handleCancel}
          width='80%'
        >
          <RMAForm
            datosRMA={listElement}
            onSubmit={onSaveChanges}
            submitText='Guardar cambios'
          />
        </Modal>
      )}
    </>
  );
};

export default Index;
