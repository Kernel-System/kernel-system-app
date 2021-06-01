import EmpleadosList from 'components/list/EmpleadosList';
import { Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
import Modal from 'components/empleados/ModalEmpleado';
import { useState } from 'react';

const { Title } = Typography;

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [sucursal, setSucursal] = useState({});

  const changeModal = () => {
    setVisible(!visible);
  };

  const changeSucursal = (value) => {
    setSucursal(value);
    changeModal();
  };

  return (
    <div>
      <Title level={3}>Empleados</Title>
      <EmpleadosList
        onClickItem={changeSucursal}
        //editItem={showModal}
        //onConfirmDelete={onConfirmDelete}
      />
      <br />
      <Link to='/admid/empleado/nuevo'>
        <Button type='primary' size='large' icon={<PlusOutlined />}>
          Añadir Nuevo Empleado
        </Button>
      </Link>
      <Modal visible={visible} sucursal={sucursal} setVis={changeModal} />
    </div>
  );
};

export default Index;
