import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row, Upload } from 'antd';
import { getAnuncio, insertAnuncio, updateAnuncio } from 'api/admin/anuncios';
import CenteredSpinner from 'components/UI/CenteredSpinner';
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
  const [imageB64, setImageB64] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  useEffect(() => {
    if (pathname.substring(15) !== 'nuevo') {
      setIsLoadingEdit(true);
      getAnuncio(id).then(({ data: { data } }) => {
        form.setFieldsValue(data);
        setImageId(form.getFieldValue('imagen'));
        setIsLoadingEdit(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beforeUpload = (file) => {
    const isJpgOrPngOrWebp =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webp';
    if (!isJpgOrPngOrWebp) {
      message.error('Solo puede subir imágenes en formato JPG/PNG/WebP');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('La imagen debe pesar menos de 2MB');
    }
    return isJpgOrPngOrWebp && isLt2M;
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setIsUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageB64) => {
        setIsUploading(false);
        setImageB64(imageB64);
        setImageId(info.file.response.data.id);
      });
    }
  };

  const addAnuncio = ({ titulo, url }) => {
    const newAnuncio = {
      imagen: imageId,
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

  const editAnuncio = ({ titulo, url }) => {
    const updatedAnuncio = {
      imagen: imageId,
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
      {isLoadingEdit ? (
        <CenteredSpinner />
      ) : (
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
                      headers={{
                        Authorization: `Bearer ${token}`,
                        'X-Requested-With': null,
                      }}
                      name='imagen'
                      listType='picture-card'
                      showUploadList={false}
                      maxCount={1}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      {imageB64 || imageId ? (
                        <img
                          src={
                            pathname.substring(15) === 'nuevo'
                              ? imageB64
                              : `${process.env.REACT_APP_DIRECTUS_API_URL}/assets/${imageId}`
                          }
                          alt='avatar'
                          style={{ width: '100%', padding: '0.5rem' }}
                        />
                      ) : (
                        <div>
                          {isUploading ? <LoadingOutlined /> : <PlusOutlined />}
                          <div style={{ marginTop: 8 }}>Subir imagen</div>
                        </div>
                      )}
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
                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={loading}
                      disabled={isUploading}
                    >
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
      )}
    </>
  );
};

export default AgregarAnuncio;
