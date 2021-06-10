import './styles.css';
import { http } from 'api';
import { useState, useEffect } from 'react';
import { List, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import { useStoreState } from 'easy-peasy';
const { Option } = Select;

const Index = ({ onConfirmDelete, onClickItem }) => {
  const [tipo, setTipo] = useState('facturas_internas');
  const [factura, setFactura] = useState([]);
  const token = useStoreState((state) => state.user.token.access_token);
  const putToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    http.get(`/items/${tipo}?fields=*`, putToken).then((resul) => {
      onSetFactura(resul.data.data);
    });
  }, [tipo]);

  const onSetFactura = (lista) => {
    const newLista = JSON.parse(JSON.stringify(lista));
    setFactura(newLista);
    setListToShow(newLista);
  };

  const onTypeChange = (e) => {
    const value = e;
    console.log(e);
    setTipo(value);
    //filtrarFacturasPorTipo(data, value);
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    filtrarFacturasPorTipo(factura, value);
  };

  const filtrarFacturasPorTipo = async (facturas_tipo, value) => {
    console.log(facturas_tipo);
    console.log(value);
    if (value.replace(/\s/g, '') === '') {
      setListToShow(facturas_tipo);
    } else if (facturas_tipo === 'facturas_externas') {
      setListToShow(
        facturas_tipo.filter((item) => item.folio.includes(parseInt(value)))
      );
    } else {
      setListToShow(
        facturas_tipo.filter((item) =>
          item.rfc_emisor.includes(value.toUpperCase())
        )
      );
    }
  };

  const [searchValue, setSearchValue] = useState('');
  const [listToShow, setListToShow] = useState([]);

  return (
    <>
      <Select
        style={{ width: '100%' }}
        optionFilterProp='children'
        defaultValue='Facturas Internas'
        onChange={onTypeChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value='facturas_internas' key='facturas_internas'>
          Facturas Internas
        </Option>
        <Option value='facturas_externas' key='facturas_externas'>
          Facturas Externas
        </Option>
      </Select>
      <Input.Search
        onChange={onSearchChange}
        placeholder={
          tipo === 'facturas_internas'
            ? 'Buscar por RFC Emisor'
            : 'Buscar por Folio'
        }
        value={searchValue}
      />
      <br />
      <List
        itemLayout='horizontal'
        size='default'
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        dataSource={listToShow}
        renderItem={(item) => {
          return (
            <List.Item key={item.rfc} actions={[]}>
              <List.Item.Meta
                title={
                  <Link
                    to={
                      tipo === 'facturas_internas'
                        ? `/cuentas/pagos_int/${item.folio}`
                        : `/cuentas/pagos_ext/${item.id}`
                    }
                  >
                    <p
                      onClick={() => {
                        console.log(item);
                      }}
                      style={{
                        cursor: 'pointer',
                        margin: 0,
                      }}
                    >
                      {`Folio: ${item.folio}`}
                    </p>
                  </Link>
                }
                description={`Emisor: ${item.rfc_emisor}`}
              />
              {`Receptor: ${item.rfc_receptor}`}
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default Index;
