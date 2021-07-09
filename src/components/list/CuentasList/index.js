import { Input, List, Select } from 'antd';
import { http } from 'api';
import { useStoreState } from 'easy-peasy';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
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
    http.get(`/items/${tipo}?fields=*,pagos.*`, putToken).then((resul) => {
      const resultado = resul.data.data.filter((factura) => {
        return factura?.metodo_pago === 'PPD';
      });
      console.log(resultado);
      onSetFactura(resultado);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                  item?.pagos?.length !== 0 ? (
                    <Link
                      to={
                        tipo === 'facturas_internas'
                          ? `/cuentas/pagos_int/${item.id}`
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
                  ) : (
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
                  )
                }
                description={`Emisor: ${item.rfc_emisor}\r\nReceptor: ${item.rfc_receptor}`}
              />
              {
                <span
                  style={{
                    display: 'inline',
                    opacity: 0.8,
                  }}
                >
                  <b>{`$${item.pagos
                    .map((dato) => dato.monto)
                    .reduce((a, b) => a + b, 0)}/$${item.total}`}</b>
                </span>
              }
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default Index;
