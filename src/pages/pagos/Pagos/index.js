import PagosList from 'components/list/PagosList';
import { Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Modal from 'components/pagos/PagosModal';
import { useState } from 'react';
import HeadingBack from 'components/UI/HeadingBack';
import { useRouteMatch } from 'react-router';
import { useStoreState } from 'easy-peasy';
import { useQueryClient } from 'react-query';

const Index = ({ tipo }) => {
  const queryClient = useQueryClient();
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  let match = useRouteMatch();

  const [visible, setVisible] = useState(false);
  const [pago, setPago] = useState({});

  const actualizar = () => {
    queryClient
      .invalidateQueries('pagos')
      .then(message.success('Cambios guardados exitosamente'));
  };

  const changeModal = () => {
    setVisible(!visible);
  };

  const changePago = (value) => {
    setPago(value);
    changeModal();
  };

  return (
    <div>
      <HeadingBack title={`Pagos: ${match.params.id_fac}`} />
      <PagosList
        onClickItem={changePago}
        tipo={tipo}
        id_fac={match.params.id_fac}
        putToken={putToken}
        //editItem={showModal}
        //onConfirmDelete={onConfirmDelete}
      />
      <br />
      <Link to='/admid/cliente/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nuevo Cliente
        </Button>
      </Link>
      <Modal
        visible={visible}
        pago={pago}
        setVis={changeModal}
        putToken={putToken}
        token={token}
        actualizar={actualizar}
      />
    </div>
  );
};

export default Index;
