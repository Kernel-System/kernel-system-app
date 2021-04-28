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

for (let i = 0; i < 11; i++) {
  originData.push({
    key: i.toString(),
    name: `Ejemplo EjemploEjemploEjemploEjemploEjemplo  ${i}`,
    productimage:
      'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    age: 32,
    address: `London Park no. ${i}`,
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
      name: '',
      age: '',
      address: '',
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
      case 'age':
        return 'number';
      case 'image':
        return 'image';
      default:
        return 'text';
    }
  };

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '150px',
      fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'image',
      dataIndex: 'image',
      width: '100px',
      //fixed: "left",
      render: (_, record) => <Image width={150} src={record.productimage} />,
      editable: false,
    },
    {
      title: 'age',
      dataIndex: 'age',
      width: '80px',
      editable: true,
    },
    {
      title: 'address',
      dataIndex: 'address',
      width: '400px',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      fixed: 'right',
      width: '100px',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="link"
              onClick={() => save(record.key)}
              icon={<CheckOutlined />}
              style={{
                marginRight: 8,
              }}
            />
            <Popconfirm title="¿Estas seguro de cancelar?" onConfirm={cancel}>
              <CloseOutlined />
            </Popconfirm>
          </span>
        ) : (
          <Button
            icon={<EditOutlined />}
            type="link"
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
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        scroll={{ x: 1500, y: 400 }}
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default Index;
