export const conceptosMovimientos = {
  Compra: 'ENTRADA',
  Venta: 'SALIDA',
  'Devolución a cliente': 'ENTRADA',
  'Devolución a proveedor': 'SALIDA',
  'Entrada por transferencia': 'ENTRADA',
  'Salida por transferencia': 'SALIDA',
  'Componente defectuoso': 'ENTRADA',
  'Componente para ensamble': 'SALIDA',
  'Producto ensamblado': 'ENTRADA',
};

export const estadoProductoRMA = {
  pendiente_enviar: 'Pendiente de enviar',
  pendiente_resolver: 'Enviado (sin resolver)',
  reparado: 'Reparado',
  intercambiado: 'Intercambiado',
  renovado: 'Producto renovado',
  credito: 'Nota de crédito',
  mixto: 'Cambio + nota de crédito',
};
