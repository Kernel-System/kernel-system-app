import { Input, Form } from 'antd';

const InputForm = ({
  titulo,
  mensaje,
  placeholder,
  type,
  required = true,
  onBlurred = () => {},
  valueDef = '',
  enable = false,
  max = 100,
  rules = '',
  value,
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
            : type === 'number'
            ? {
                type: 'string',
                message: `${mensaje}`,
              }
            : {
                type: 'string',
                message: `${mensaje}`,
              },
          rules,
        ]}
      >
        <Input
          key={`${titulo}input`}
          placeholder={placeholder}
          style={{ width: '100%' }}
          value={value}
          onBlur={(e) => {
            onBlurred(e.target.value);
          }}
          disabled={enable}
          maxLength={max}
        />
      </Form.Item>
    </div>
  );
};

export default InputForm;
