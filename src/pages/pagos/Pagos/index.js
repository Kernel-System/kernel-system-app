import PagosList from 'components/list/PagosList';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Modal from 'components/pagos/PagosModal';
import { useState } from 'react';
import HeadingBack from 'components/UI/HeadingBack';
import { useRouteMatch } from 'react-router';

const Index = ({ tipo }) => {
  let match = useRouteMatch();

  const [visible, setVisible] = useState(false);
  const [pago, setPago] = useState({});

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
        //editItem={showModal}
        //onConfirmDelete={onConfirmDelete}
      />
      <br />
      <Link to='/admid/cliente/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nuevo Cliente
        </Button>
      </Link>
      <Modal visible={visible} pago={pago} setVis={changeModal} />
    </div>
  );
};

export default Index;
