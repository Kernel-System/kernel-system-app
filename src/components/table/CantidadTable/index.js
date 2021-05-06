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
} from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const originData = [];

for (let i = 0; i < 3; i++) {
  originData.push({
    key: i.toString(),
    nombre: `Producto  ${i}`,
    productimage:
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    cantidad: 2,
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

  const edit = (record) => {
    form.setFieldsValue({
      nombre: '',
      cantidad: '',
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
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
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
  });

  return (
    <Form form={form} component={false}>
      <Table
        columnWidth='10px'
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
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
