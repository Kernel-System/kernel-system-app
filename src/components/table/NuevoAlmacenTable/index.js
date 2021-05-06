import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './style.css';

import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Button,
  Image,
  Typography,
  Checkbox,
} from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Title } = Typography;
const originData = [];

for (let i = 0; i < 3; i++) {
  originData.push({
    key: i.toString(),
    nombre: `Producto  ${i}`,
    productimage:
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    cantidad: 2,
    expand: true,
    series: [],
  });
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Index = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const changeSerie = (value, indice, actual) => {
    if (value.split(' ').join('') !== '') {
      const lista = JSON.parse(JSON.stringify(data));
      lista[indice].series[actual] = value;
      console.log(lista[indice].series);
      setData(JSON.parse(JSON.stringify(lista)));
    }
  };

  const inputs = (fila, numero, indice) => {
    const arreglo = Array.from(Array(numero).keys());
    const numeros = arreglo.map((actual) => {
      return (
        <Input
          key={`${fila.key}${actual}`}
          placeholder='Número de Serie'
          size='large'
          style={{ width: '100%', marginBottom: '10px' }}
          onBlur={(e) => {
            changeSerie(e.target.value, indice, actual);
          }}
          disabled={false}
        />
      );
    });
    return numeros;
  };

  const edit = (record) => {
    form.setFieldsValue({
      nombre: '',
      cantidad: '',
      expand: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const cantidad = newData[index].cantidad;
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        if (row.cantidad < cantidad)
          newData[index].series.splice(cantidad - 2, row.cantidad);
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const changeCheck = async (key) => {
    const newData = JSON.parse(JSON.stringify(data));
    const index = newData.findIndex((item) => key === item.key);
    newData[index].expand = !newData[index].expand;
    newData[index].series = [];
    console.log(newData[index]);
    setData(newData);
  };

  const typeColumn = (type) => {
    switch (type) {
      case 'cantidad':
        return 'number';
      case 'image':
        return 'image';
      case 'expand':
        return null;
      default:
        return 'text';
    }
  };

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'image',
      width: '40px',
      //fixed: "left",
      render: (_, record) => <Image width={150} src={record.productimage} />,
      editable: false,
    },
    {
      title: 'NOMBRE',
      dataIndex: 'nombre',
      width: '70px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'CANTIDAD',
      dataIndex: 'cantidad',
      width: '30px',
      editable: true,
    },
    {
      title: '¿TIENE SERIE?',
      dataIndex: 'expand',
      width: '30px',
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <Checkbox
            onClick={() => {
              changeCheck(record.key);
            }}
            checked={record.expand}
            disabled={!editable}
          />
        );
      },
    },
    {
      title: '',
      dataIndex: 'operation',
      //fixed: breakpoint.lg ? "left": false,
      width: '50px',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type='link'
              onClick={() => save(record.key)}
              icon={<CheckOutlined />}
              style={{
                marginRight: 8,
              }}
            />
            <Popconfirm title='¿Estas seguro de cancelar?' onConfirm={cancel}>
              <CloseOutlined />
            </Popconfirm>
          </span>
        ) : (
          <Button
            icon={<EditOutlined />}
            type='link'
            disabled={editingKey !== ''}
            onClick={() => edit(record)}
          >
            Editar
          </Button>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    if (col.dataIndex !== 'expand') {
      return {
        ...col,

        onCell: (record) => ({
          record,
          inputType: typeColumn(col.dataIndex),
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    } else return col;
  });

  return (
    <Form form={form} component={false}>
      <Table
        defaultExpandAllRows={true}
        columnWidth='10px'
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ margin: 0 }}>
              <Title level={4}>Series</Title>
              {inputs(record, record.cantidad, record.key)}
            </div>
          ),
          rowExpandable: (record) => record.expand,
        }}
        scroll={{ x: 1000, y: 600 }}
        dataSource={data}
        columns={mergedColumns}
        rowClassName='editable-row'
        /*pagination={{
          onChange: cancel,
        }}*/
      />
    </Form>
  );
};

export default Index;
