import { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import ListaProductos from 'components/list/ProductosCompradosList';
import * as CRUD from 'api/compras/productos_comprados';
import ProductoCompradoForm from 'components/forms/ProductoCompradoForm';

const ProductosComprados = () => {
  const showModal = (element, list) => {
    setIsModalVisible(true);
    if (element === undefined && list.length) {
      const newElement =
        list.find((elem) => elem.id === elementId) ?? listElement;
      setListElement(newElement);
    } else {
      const newElement = element ?? listElement;
      setListElement(newElement);
      setElementId(newElement.id);
    }
  };

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

  const updateMutation = useMutation(CRUD.updateItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('productos_comprados').then(() => {
        message.success('Cambios guardados exitosamente');
      });
    },
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [listElement, setListElement] = useState({});
  const [elementId, setElementId] = useState();

  return (
    <>
      <ListaProductos
        onClickItem={showModal}
        editItem={showModal}
        itemOpened={isModalVisible}
      ></ListaProductos>
      <br />

      <Link to='/compras/registrar'>
        <Button type='primary' icon={<PlusOutlined />}>
          Registrar Compra
        </Button>
      </Link>
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
    </>
  );
};

export default ProductosComprados;
