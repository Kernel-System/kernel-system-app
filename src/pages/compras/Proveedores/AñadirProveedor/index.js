import React, { useState } from 'react';
import LectorFacturas from 'components/shared/facturas/LectorFacturas';
import ProveedorForm from 'components/forms/ProveedorForm';
import { Typography,  Breadcrumb , PageHeader} from 'antd';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';

const { Title } = Typography;

const Index = () => {
    const onFacturaLeida = (factura) => {
        const emisor = factura['cfdi:Emisor'][0].$;
        setProveedor((prev) => ({
            ...prev,
            rfc: emisor.Rfc,
            nombre: emisor.Nombre,
            regimen_fiscal: emisor.RegimenFiscal,
        }));
    };
    const proveedorInicial = {
        rfc: '',
        nombre: '',
        razon_social: '',
    };
    const [proveedor, setProveedor] = useState(proveedorInicial);
    const history = useHistory();

    return (
        <>
            <PageHeader
                className='site-page-header'
                onBack={() => history.goBack()}
                title="Nuevo proveedor"
                subTitle={null}
                style={{ padding: "0 0 12px 0" }}
            />
            {/* <Breadcrumb>
                <Link to='/proveedores'>
                    <Breadcrumb.Item>Proveedores</Breadcrumb.Item>
                </Link>
                <Breadcrumb.Item>Agregar proveedor</Breadcrumb.Item>
            </Breadcrumb>
            <Title>Nuevo proveedor</Title> */}
            <LectorFacturas onSuccess={onFacturaLeida} />
            <br/>
            <Title level={4}>Datos del proveedor</Title>
            <ProveedorForm
                datosProveedor={proveedor}
                submitText='AÑADIR PROVEEDOR'
            ></ProveedorForm>
        </>
    );
};

export default Index;
