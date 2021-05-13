import React, { useState } from 'react';
import LectorFacturas from 'components/shared/facturas/LectorFacturas';
import ProveedorForm from 'components/forms/ProveedorForm';
import Header from 'components/UI/HeadingBack';
import { message, Typography } from 'antd';
import axios from 'axios';

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

    const insertItem = (values) => {
       axios
            .post(
                'https://kernel-system-api.herokuapp.com/items/proveedores',
                values
            )
            .then(() => {
                onInserted();
            });
    };

    const onInserted = () => {
        message.success('El Proveedor ha sido registrado exitosamente');
    };

    return (
        <>
            <Header title='Nuevo proveedor' />
            <LectorFacturas onSuccess={onFacturaLeida} />
            <br />
            <Title level={4}>Datos del proveedor</Title>
            <ProveedorForm
                datosProveedor={proveedor}
                submitText='AÑADIR PROVEEDOR'
                cleanOnSubmit
                onSubmit={insertItem}
            ></ProveedorForm>
        </>
    );
};

export default Index;
