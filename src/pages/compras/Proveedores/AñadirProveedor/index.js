import React, { useState } from 'react';
import LectorFacturas from 'components/shared/facturas/LectorFacturas';
import ProveedorForm from 'components/forms/ProveedorForm';
import Header from 'components/UI/HeadingBack'
import { Typography} from 'antd';

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

    return (
        <>
            <Header
                title="Nuevo proveedor"
            />
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
