import { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import ListaProductos from 'components/list/ProductosCompradosList';
import * as CRUD from 'api/compras/productos_comprados';
import ProductoCompradoForm from 'components/forms/ProductoCompradoForm';
import { useStoreState } from 'easy-peasy';

const ProductosComprados = () => {
  const [isModalVisible, setIsModalVisible] = useState();
  const [listElement, setListElement] = useState();
  const [elementId, setElementId] = useState();

  const onClickItem = (element) => {
    const newId = element?.id;
    setIsModalVisible(true);
    setListElement(element);
    setElementId(newId);
  };

  function refreshItem(list) {
    if (isModalVisible && list.length) {
      const newElement =
        list.find((elem) => elem.id === elementId) ?? listElement;
      setListElement(newElement);
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSaveChanges = (values) => {
    const newValues = {
      id: listElement.id,
      producto_catalogo: values.producto_catalogo,
    };
    updateMutation.mutate(newValues);
  };

  const queryClient = useQueryClient();
  const token = useStoreState((state) => state.user.token.access_token);

  const updateMutation = useMutation(
    (values) => CRUD.updateItem(values, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('productos_comprados').then(() => {
          message.success('Cambios guardados exitosamente');
        });
      },
    }
  );

  return (
    <>
      <ListaProductos
        onClickItem={onClickItem}
        editItem={onClickItem}
        refreshItem={refreshItem}
      ></ListaProductos>
      <br />

      <Link to='/compras/registrar'>
        <Button type='primary' icon={<PlusOutlined />}>
          Registrar Compra
        </Button>
      </Link>
      {listElement ? (
        <Modal
          title={listElement.descripcion}
          visible={isModalVisible}
          footer={null}
          onCancel={handleCancel}
          width='70%'
        >
          <ProductoCompradoForm
            datosProducto={listElement}
            onSubmit={onSaveChanges}
            submitText='Guardar cambios'
          />
        </Modal>
      ) : null}
    </>
  );
};

export default ProductosComprados;
