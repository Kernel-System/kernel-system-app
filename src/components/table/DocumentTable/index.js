import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './style.css';
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';

import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
const originData = [];

/*for (let i = 0; i < 5; i++) {
  originData.push({
    key: i.toString(),
    id: '', //25
    folio: '', //25
    serie: '', //40
    moneda_dr: '', //char 3
    tipo_cambio_dr: '', //decimal 10
    metodo_de_pago: '', //char 3
    num_parcialidad: 0, //36
    imp_saldo_ant: 0,
    imp_saldo_insoluto: 0,
    name: `Documento ${i + 1}`,
    age: 32,
    address: `London Park no. ${i + 1}`,
  });
}*/

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
              message: `Ingrese ${title}`,
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
  const [count, setCount] = useState(0);
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      id: '', //25
      folio: '', //25
      serie: '', //40
      moneda_dr: '', //char 3
      tipo_cambio_dr: '', //decimal 10
      metodo_de_pago: '', //char 3
      num_parcialidad: 0, //36
      imp_saldo_ant: 0,
      imp_saldo_insoluto: 0,
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
      case 'number':
        return 'number';
      case 'image':
        return 'image';
      default:
        return 'text';
    }
  };

  const handleDelete = (key) => {
    const dataSource = [...data];
    setData(dataSource.filter((item) => item.key !== key));
  };

  const handleAdd = () => {
    console.log('entre');
    const newData = [...data];
    newData.push({
      key: count,
      id: '', //25
      folio: '', //25
      serie: '', //40
      moneda_dr: '', //char 3
      tipo_cambio_dr: '', //decimal 10
      metodo_de_pago: '', //char 3
      num_parcialidad: 0, //36
      imp_saldo_ant: 0,
      imp_saldo_insoluto: 0,
    });
    console.log(newData);
    setCount(count + 1);
    setData(newData);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '100px',
      ellipsis: true,
      editable: true,
    },
    {
      title: 'Folio',
      dataIndex: 'folio',
      width: '100px',
      ellipsis: true,
      editable: true,
    },
    {
      title: 'Serie',
      dataIndex: 'serie',
      width: '100px',
      ellipsis: true,
      editable: true,
    },
    {
      title: 'Moneda DR',
      dataIndex: 'moneda_dr',
      width: '100px',
      ellipsis: true,
      editable: true,
    },
    {
      title: 'Tipo de cambio DR',
      dataIndex: 'tipo_cambio_dr',
      type: 'number',
      width: '80px',
      editable: true,
    },
    {
      title: 'Metodo de Pago',
      dataIndex: 'metodo_de_pago',
      width: '100px',
      ellipsis: true,
      editable: true,
    },
    {
      title: 'Número de Parcialidad',
      dataIndex: 'num_parcialidad',
      type: 'number',
      width: '80px',
      editable: true,
    },
    {
      title: 'Imp. Saldo Ant.',
      dataIndex: 'imp_saldo_ant',
      type: 'number',
      width: '80px',
      editable: true,
    },
    {
      title: 'Imp. Saldo Ins',
      dataIndex: 'imp_saldo_insoluto',
      type: 'number',
      width: '80px',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      width: '100px',
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
          <span>
            <Button
              icon={<EditOutlined />}
              type='link'
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              Editar
            </Button>
            <Popconfirm
              title='¿Estas seguro de querer eliminar?'
              onConfirm={() => handleDelete(record.key)}
            >
              <DeleteOutlined />
            </Popconfirm>
          </span>
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
        inputType: typeColumn(col.type),
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
        scroll={{ x: 1500, y: 600 }}
        dataSource={data}
        columns={mergedColumns}
        rowClassName='editable-row'
        pagination={{
          onChange: cancel,
        }}
      />
      <Button
        type='primary'
        onClick={() => {
          handleAdd();
        }}
        style={{ marginBottom: '8px' }}
      >
        Agrega una fila
      </Button>
    </Form>
  );
};

export default Index;