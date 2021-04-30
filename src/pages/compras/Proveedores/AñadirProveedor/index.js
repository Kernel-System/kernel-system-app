import React,{useState} from 'react';
import LectorProveedores from 'components/util/facturas/LectorFacturas';
import ProveedorForm from 'components/forms/ProveedorForm';
import { Typography } from 'antd';

const { Title } = Typography;

const Index = () => {
    
    const onFacturaLeida = (factura) => {
        const emisor = factura['cfdi:Emisor'][0].$;
        console.log({emisor})
        setProveedor((prev)=>({...prev, 
            rfc: emisor.Rfc,
            nombre: emisor.Nombre,
            regimen_fiscal: emisor.RegimenFiscal}))
    };
    const proveedorInicial = {
        rfc: "",
        nombre: "",
        razon_social: "",
    }
    const [proveedor, setProveedor] = useState(proveedorInicial)

    return (
        <div>
            <Title>Nuevo proveedor</Title>
            <LectorProveedores onSuccess={onFacturaLeida}/>
            <ProveedorForm datosProveedor={proveedor} submitText="AÑADIR PROVEEDOR"></ProveedorForm>
        </div>
    );
};

export default Index;
