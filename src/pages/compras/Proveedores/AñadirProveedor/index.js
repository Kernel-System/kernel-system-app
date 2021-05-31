import React, { useState } from 'react';
import LectorFacturas from 'components/shared/facturas/LectorFacturas';
import ProveedorForm from 'components/forms/ProveedorForm';
import Header from 'components/UI/HeadingBack';
import { message, Typography } from 'antd';
import { insertItems } from 'api/shared/proveedores';

const { Title } = Typography;

const Index = () => {
    const onFacturaLeida = (factura) => {
        const emisor = factura['cfdi:Emisor'][0].$;
        setProveedor((prev) => ({
            ...prev,
            rfc: emisor.Rfc,
            razon_social: emisor.Nombre,
            regimen_fiscal: emisor.RegimenFiscal,
        }));
    };
    const [proveedor, setProveedor] = useState({});

    const insertItem = async (values) => {
        let  success = false;
        await insertItems(values)
            .then((result) => {
                if (result.status === 200) {
                    onSuccess();
                    success = true;
                }
            })
            .catch((error) => {
                onError(error);
                success = false;
            });

        return success;
    };
    const onSuccess = async () => {
        message.success('El Proveedor ha sido registrado exitosamente');
    };
    const onError = async (error) => {
        if (
            error.response.data.errors[0].message.includes('has to be unique')
        ) {
            message.warn('Esta proveedor ya ha sido registrado previamente');
        }
    };

    return (
        <>
            <Header title='Nuevo proveedor' />
            <LectorFacturas onSuccess={onFacturaLeida} />
            <br />
            <Title level={4}>Datos del proveedor</Title>
            <ProveedorForm
                itemData={proveedor}
                submitText='AÑADIR PROVEEDOR'
                cleanOnSubmit
                onSubmit={insertItem}
            ></ProveedorForm>
        </>
    );
};

export default Index;
