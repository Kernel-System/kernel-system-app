import { Input, Form } from 'antd';

const Index = ({ titulo, mensaje, placeholder, type, onBlurred }) => {
  return (
    <div>
      <Form.Item
        key={titulo}
        name={titulo}
        rules={[
          {
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
          size='large'
          placeholder={placeholder}
          style={{ width: '100%' }}
        />
      </Form.Item>
    </div>
  );
};

export default Index;