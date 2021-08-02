import { http } from 'api';

export const getItems = (sort, token) => {
  return http.get(
    `/items/rmas?fields=estado, fecha, folio, id
    , compra.no_compra, compra.proveedor.rfc, compra.proveedor.razon_social, compra.proveedor.regimen_fiscal, compra.proveedor.contacto
    , productos_rma.id, productos_rma.problema, productos_rma.serie, productos_rma.rma, productos_rma.estado
    , productos_rma.producto_comprado.descripcion, productos_rma.producto_comprado.codigo, productos_rma.producto_comprado.unidad, productos_rma.producto_comprado.id
    &sort[]=${sort === 'recent' ? '-' : '+'}fecha`,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getItemsMovimiento = (sort, token) => {
  return http.get(
    `/items/rmas?fields=id
    	, estado, fecha, folio
      , compra.no_compra, compra.proveedor.rfc
      , productos_rma.id, productos_rma.problema, productos_rma.serie, productos_rma.rma, productos_rma.estado
      , productos_rma.producto_comprado.id
      , productos_rma.producto_comprado.producto_catalogo.tipo_de_venta
	  	, productos_rma.producto_comprado.producto_catalogo.codigo
	 	 	, productos_rma.producto_comprado.producto_catalogo.imagenes
			, productos_rma.producto_comprado.producto_catalogo.titulo
			, productos_rma.producto_comprado.producto_catalogo.descripcion
			, productos_rma.producto_comprado.producto_catalogo.clave
			, productos_rma.producto_comprado.producto_catalogo.unidad_cfdi
      , productos_rma.producto_comprado.producto_catalogo.inventario.*
      &sort[]=${!sort || sort === 'recent' ? '-' : '+'}fecha`,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const insertItems = (values, token) => {
  return http.post(
    '/items/rmas',
    values,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const updateItem = (values, token) => {
  return http.patch(
    '/items/rmas/' + values.id,
    values,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const updateProductosRMA = (idsProductos, values, token) => {
  return http.patch(
    `/items/productos_rma`,
    {
      keys: idsProductos,
      data: values,
    },
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deleteItem = async (values, token) => {
  return http.delete(
    '/items/rmas/' + values.id,
    token && {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
