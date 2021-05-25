import { InputNumber, Form } from 'antd';

const Index = ({
  titulo,
  mensaje,
  placeholder,
  max,
  min,
  required = true,
  onBlurred = () => {},
  valueDef = '',
  enable = false,
  formato,
  paso = 1,
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
        ]}
      >
        <InputNumber
          key={`${titulo}inputnumber`}
          //size='large'
          placeholder={placeholder}
          style={{ width: '100%' }}
          defaultValue={valueDef}
          disabled={enable}
          onBlur={(e) => {
            onBlurred(
              e.target.value.replace(/\$\s?|(,*)/g, '').replace('%', '')
            );
          }}
          formatter={(value) =>
            formato === 'precio'
              ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : formato === 'porcentaje'
              ? `${value}%`
              : `${value}`
          }
          parser={(value) =>
            formato === 'precio'
              ? value.replace(/\$\s?|(,*)/g, '')
              : formato === 'porcentaje'
              ? value.replace('%', '')
              : value
          }
          step={paso}
          max={max}
          min={min}
        />
      </Form.Item>
    </div>
  );
};

export default Index;
