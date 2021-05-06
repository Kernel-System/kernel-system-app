import { Input, Form } from 'antd';

const Index = ({
  titulo,
  mensaje,
  placeholder,
  type,
  required = true,
  onBlurred,
  valueDef = '',
  enable = false,
}) => {
  return (
    <div>
      <Form.Item
        key={titulo}
        name={titulo}
        rules={[
          required === false
            ? {
                required: false,
                message: `${mensaje}`,
              }
            : {
                required: true,
                message: `${mensaje}`,
              },
          type === 'email'
            ? {
                type: 'email',
                message: `${mensaje}`,
              }
            : {
                type: 'string',
                message: `${mensaje}`,
              },
        ]}
      >
        <Input
          key={`${titulo}input`}
          //size='large'
          placeholder={placeholder}
          style={{ width: '100%' }}
          defaultValue={valueDef}
          disabled={enable}
        />
      </Form.Item>
    </div>
  );
};

export default Index;
