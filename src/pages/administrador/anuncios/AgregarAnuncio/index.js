import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Upload } from 'antd';
import { getAnuncio, insertAnuncio, updateAnuncio } from 'api/admin/anuncios';
import HeadingBack from 'components/UI/HeadingBack';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { getBase64 } from 'utils/functions';

const AgregarAnuncio = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const token = useStoreState((state) => state.user.token.access_token);

  useEffect(() => {
    if (pathname.substring(15) !== 'nuevo') {
      getAnuncio(id).then(({ data: { data } }) => {
        form.setFieldsValue(data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Solo puede subir imágenes en formato JPG/PNG');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('La imagen debe pesar menos de 2MB');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setIsUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setIsUploading(false);
        console.log(imageUrl);
      });
    }
  };

  const addAnuncio = ({ imagen, titulo, url }) => {
    const newAnuncio = {
      imagen: {
        storage: 'amazon',
        filename_download: imagen.file.name,
        type: imagen.file.type,
        filesize: imagen.file.size,
        title: imagen.file.name,
      },
      titulo,
      url,
    };
    setLoading(true);
    insertAnuncio(newAnuncio, token)
      .then(() => {
        setLoading(false);
        message.success('Se ha creado el anuncio correctamente', 2, () =>
          history.push('/admin/anuncio')
        );
      })
      .catch(() => {
        setLoading(false);
        message.error('Lo sentimos, ha ocurrido un error');
      });
  };

  const editAnuncio = ({ imagen, titulo, url }) => {
    const updatedAnuncio = {
      imagen: {
        storage: 'amazon',
        filename_download: imagen.file.name,
        type: imagen.file.type,
        filesize: imagen.file.size,
        title: imagen.file.name,
      },
      titulo,
      url,
    };
    setLoading(true);
    updateAnuncio(id, updatedAnuncio, token)
      .then(() => {
        setLoading(false);
        message.success('Se ha actualizado el anuncio correctamente', 2, () =>
          history.push('/admin/anuncio')
        );
      })
      .catch(() => {
        setLoading(false);
        message.error('Lo sentimos, ha ocurrido un error');
      });
  };

  return (
    <>
      <HeadingBack
        title={
          pathname.substring(15) === 'nuevo'
            ? 'Añadir nuevo anuncio'
            : 'Editar anuncio'
        }
      />
      <Row>
        <Col xs={24} lg={12}>
          <Form
            form={form}
            name='newAnuncioForm'
            layout='vertical'
            requiredMark='optional'
            onFinish={
              pathname.substring(15) === 'nuevo' ? addAnuncio : editAnuncio
            }
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name='imagen'
                  label='Imagen'
                  valuePropName='file'
                  required
                >
                  <Upload
                    action={`${process.env.REACT_APP_DIRECTUS_API_URL}/files`}
                    name='imagen'
                    listType='picture-card'
                    maxCount={1}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    <div>
                      {isUploading ? <LoadingOutlined /> : <PlusOutlined />}
                      <div style={{ marginTop: 8 }}>Subir imagen</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name='titulo' label='Título' required>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name='url' label='URL' required>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <Button type='primary' htmlType='submit' loading={loading}>
                    {pathname.substring(15) === 'nuevo'
                      ? 'Añadir anuncio'
                      : 'Guardar cambios'}
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

export default AgregarAnuncio;
