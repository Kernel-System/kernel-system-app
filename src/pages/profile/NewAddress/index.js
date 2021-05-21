import { Button, Col, Form, Input, message, Row } from 'antd';
import { getUserData } from 'api/profile';
import {
  getUserDireccion,
  getUserDireccionesCount,
  insertUserDireccion,
  updateUserDireccion,
} from 'api/shared/addresses';
import Heading from 'components/UI/Heading';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useHistory, useLocation, useParams } from 'react-router';
import {
  calleRules,
  coloniaRules,
  cpRules,
  entreCalleRules,
  estadoRules,
  localidadRules,
  municipioRules,
  noExtRules,
  noIntRules,
  paisRules,
} from 'utils/validations/address';

const NewAddress = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();
  const [form] = Form.useForm();
  const token = useStoreState((state) => state.user.token.access_token);
  const user = useQuery('user', () => getUserData(token));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pathname.substring(13) !== 'nueva') {
      getUserDireccion(id, token).then(({ data: { data } }) => {
        form.setFieldsValue(data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addAddress = (values) => {
    setLoading(true);
    getUserDireccionesCount(user.data.cliente.rfc, token)
      .then(({ data: { meta } }) => {
        const newAddress = {
          ...values,
          fiscal: meta.total_count === 0 ? 'true' : 'false',
          rfc_cliente: user.data.cliente.rfc,
        };
        insertUserDireccion(newAddress, token)
          .then(() => {
            setLoading(false);
            message.success(`Se ha creado la dirección correctamente`, 2, () =>
              history.push('/direcciones')
            );
          })
          .catch(() => {
            setLoading(false);
            message.error(`Lo sentimos, ha ocurrido un error`);
          });
      })
      .catch(() => {
        setLoading(false);
        message.error(`Lo sentimos, ha ocurrido un error`);
      });
  };

  const editAddress = (updatedAddress) => {
    setLoading(true);
    updateUserDireccion(id, updatedAddress, token)
      .then(() => {
        setLoading(false);
        message.success(`Se ha actualizado la dirección correctamente`, 2, () =>
          history.push('/direcciones')
        );
      })
      .catch(() => {
        setLoading(false);
        message.error(`Lo sentimos, ha ocurrido un error`);
      });
  };

  return (
    <>
      <Heading
        title={
          pathname.substring(13) === 'nueva'
            ? 'Añadir nueva dirección'
            : 'Editar dirección'
        }
      />
      <Row>
        <Col xs={24} lg={12}>
          <Form
            form={form}
            name='newAddressForm'
            layout='vertical'
            requiredMark='optional'
            onFinish={
              pathname.substring(13) === 'nueva' ? addAddress : editAddress
            }
          >
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item name='calle' label='Calle' rules={calleRules}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name='no_ext' label='No. Ext.' rules={noExtRules}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name='no_int' label='No. Int.' rules={noIntRules}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name='cp' label='Código Postal' rules={cpRules}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name='entre_calle_1'
                  label='Entre calle 1'
                  rules={entreCalleRules}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name='entre_calle_2'
                  label='Entre calle 2'
                  rules={entreCalleRules}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name='colonia' label='Colonia' rules={coloniaRules}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name='localidad'
                  label='Localidad'
                  rules={localidadRules}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name='municipio'
                  label='Municipio'
                  rules={municipioRules}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name='estado' label='Estado' rules={estadoRules}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name='pais' label='País' rules={paisRules}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item>
                  <Button type='primary' htmlType='submit' loading={loading}>
                    Guardar cambios
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default NewAddress;
