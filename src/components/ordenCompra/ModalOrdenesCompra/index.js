import { Modal, Button, Row, Col, Table } from 'antd';
import TextLabel from '../../UI/TextLabel';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useState, useEffect } from 'react';
import { NumeroALetras } from 'api/numeroTexto';
import logo from 'utils/Cotizacion.png';
import moment from 'moment';

const formatoFecha = 'DD MMMM YYYY, hh:mm:ss a';

const Index = ({ visible, orden, setVis }) => {
  const [lista, setlista] = useState([]);
  useEffect(() => {
    let productos = [];
    orden?.productos_ordenes_compra?.forEach((producto, index) => {
      productos.push({ ...producto, key: index });
    });
    onSetLista(productos);
  }, [orden]);

  const formatPrice = (price) => {
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return formatter.format(price);
  };

  const onSetLista = (prodLista) => {
    const newLista = JSON.parse(JSON.stringify(prodLista));
    setlista(newLista);
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

  const columns = [
    {
      title: 'CODIGO-PROV',
      dataIndex: 'codigo_prov',
      width: '25px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'CVE-SAT',
      dataIndex: 'cve_sat',
      width: '22px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'DESCRIPCIÓN',
      dataIndex: 'descripcion',
      width: '50px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'Unidad.',
      dataIndex: 'unidad',
      width: '25px',
      //fixed: 'left',
      ellipsis: true,
    },
    {
      title: 'CANTIDAD',
      dataIndex: 'cantidad',
      type: 'number',
      width: '20px',
      editable: true,
    },
    {
      title: 'P.UNITARIO',
      dataIndex: 'precio_unitario',
      width: '25px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'TOTAL',
      dataIndex: 'total',
      width: '30px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    if (col.dataIndex !== 'expand') {
      return {
        ...col,
        onCell: (record) => ({
          record,
          key: record.id,
          type: typeColumn(col.type),
          //   dataIndex: col.dataIndex,
          title: col.title,
        }),
      };
    } else return col;
  });

  const generarPDF = () => {
    const doc = new jsPDF();
    let proveedor = orden.rfc_proveedor;
    const productos = [];
    console.log(orden);
    orden?.productos_ordenes_compra.forEach((producto) => {
      productos.push([
        producto.codigo_prov,
        producto.cve_sat,
        producto.descripcion,
        producto.unidad,
        producto.cantidad,
        formatPrice(producto.precio_unitario),
        formatPrice(producto.total),
      ]);
    });
    doc.autoTable({
      //styles: { fillColor: [255, 0, 0] },
      //columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } }, // Cells in first column centered and green
      bodyStyles: {
        fontSize: 7.5,
        //lineWidth: 0.1,
        lineColor: [0, 0, 0],
        minCellHeight: 35,
      },
      pageBreak: 'auto',
      tableWidth: 'auto',
      columnStyles: {
        0: { cellWidth: 32.5 },
        1: { cellWidth: 100 },
        // etc
      },
      body: [[[], [], []]],
      didDrawCell: (data) => {
        console.log(data.row);
        if (
          data.column.index === 0 &&
          data.row.index === 0 &&
          data.cell.section === 'body'
        ) {
          const niceimage = new Image();
          niceimage.src = logo;
          var dim = data.cell.height - data.cell.padding('vertical');
          doc.addImage(niceimage, 'JPEG', data.cell.x, data.cell.y, dim, dim);
          let borderLineOffset = 1;
          const columnWidth = data.table.columns[0].width;
          data.doc.line(
            data.cursor.x + columnWidth,
            data.cursor.y + data.row.height - borderLineOffset / 2,
            data.cursor.x,
            data.cursor.y + data.row.height - borderLineOffset / 2
          );
          data.doc.line(
            data.cursor.x,
            data.cursor.y + data.row.height - borderLineOffset / 2,
            data.cursor.x,
            data.cursor.y
          );
          data.doc.line(
            data.cursor.x + columnWidth,
            data.cursor.y,
            data.cursor.x,
            data.cursor.y
          );
        }
        if (data.column.index === 1 && data.cell.section === 'body') {
          let borderLineOffset = 1;

          doc.addFont('./CgBroadway.ttf', 'Broadway', 'normal');
          doc.setFont('Broadway');
          doc.setFontSize(18.4);
          doc.setTextColor(226, 107, 10);
          const columnWidth = data.table.columns[1].width;
          doc.text(
            'KERNEL SYSTEMS',
            data.cursor.x + columnWidth / 3,
            data.cursor.y + 6.0
          );
          doc.setFontSize(6.1);
          doc.setTextColor(36, 64, 98);
          doc.text(
            'MARQUEZ DE LEON Y LIC. VERDAD, LA PAZ, B.C.SUR',
            data.cursor.x + columnWidth / 3 + 1.5,
            data.cursor.y + 8.0
          );
          doc.addFont('./ArialNarrowMTStd.ttf', 'ArialNarrow', 'normal');
          doc.setFont('ArialNarrow');
          doc.setFontSize(6.1);
          doc.setTextColor(36, 64, 98);
          doc.text(
            `TEL.- (612)12-58699 CEL.- (612)3489216 email:maph666@gmail.com`,
            data.cursor.x + columnWidth / 3 - 0.5,
            data.cursor.y + 10.0
          );
          doc.setFont('Broadway');
          doc.setFontSize(14.3);
          doc.setTextColor(36, 64, 98);
          doc.text(
            `ORDEN DE COMPRA: ${orden.folio}`,
            data.cursor.x + columnWidth / 2.5,
            data.cursor.y + data.row.height - borderLineOffset - 1
          );
          data.doc.line(
            data.cursor.x + columnWidth,
            data.cursor.y + data.row.height - borderLineOffset / 2,
            data.cursor.x,
            data.cursor.y + data.row.height - borderLineOffset / 2
          );
          data.doc.line(
            data.cursor.x + columnWidth,
            data.cursor.y,
            data.cursor.x,
            data.cursor.y
          );
        }
        if (data.column.index === 2 && data.cell.section === 'body') {
          //
          doc.setFont('Courier-Bold');
          doc.setFontSize(10);
          doc.setTextColor(36, 64, 98);
          let borderLineOffset = 1;
          doc.text(
            `${orden.fecha_creacion.substring(0, 10)}`,
            data.cursor.x,
            data.cursor.y + data.row.height / 2
          );
          const columnWidth = data.table.columns[2].width;
          data.doc.line(
            data.cursor.x + columnWidth,
            data.cursor.y + data.row.height - borderLineOffset / 2,
            data.cursor.x,
            data.cursor.y + data.row.height - borderLineOffset / 2
          );
          data.doc.line(
            data.cursor.x + columnWidth,
            data.cursor.y + data.row.height - borderLineOffset / 2,
            data.cursor.x + columnWidth,
            data.cursor.y
          );
          data.doc.line(
            data.cursor.x + columnWidth,
            data.cursor.y,
            data.cursor.x,
            data.cursor.y
          );
        }
      },
    });
    var firstTable = doc.lastAutoTable.finalY;
    let tablaContacto = [];
    if (proveedor.contacto !== null && proveedor.correo !== null) {
      tablaContacto.push([
        `CONTACTO: ${proveedor.contacto}`,
        `EMAIL: ${proveedor.correo}`,
      ]);
    } else if (proveedor.contacto !== null) {
      tablaContacto.push([`CONTACTO: ${proveedor.contacto}`]);
    } else if (proveedor.correo !== null) {
      tablaContacto.push([`EMAIL: ${proveedor.correo}`]);
    }
    tablaContacto.push([
      `EMPRESA: ${proveedor.razon_social}`,
      `RFC: ${proveedor.rfc}`,
    ]);
    if (proveedor.cp !== null) {
      tablaContacto.push([
        `DOMICILIO: ${proveedor.calle} No. ${proveedor.no_ext}${
          proveedor.entre_calle_1 && `, entre ${proveedor.entre_calle_1}`
        }Col. ${proveedor.colonia} ${proveedor.cp} ${
          proveedor.localidad && `- ${proveedor.localidad}`
        }, ${proveedor.municipio}, ${proveedor.estado}`,
      ]);
    }
    if (proveedor.telefono !== null && proveedor.whatsapp !== null) {
      tablaContacto.push([
        `TELEFONOS: ${proveedor.telefono} - WHATSAPP: ${proveedor.whatsapp}`,
      ]);
    } else if (proveedor.telefono !== null) {
      tablaContacto.push([`TELEFONOS: ${proveedor.telefono}`]);
    } else if (proveedor.whatsapp !== null) {
      tablaContacto.push([`WHATSAPP: ${proveedor.whatsapp}`]);
    }

    doc.autoTable({
      //columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } }, // Cells in first column centered and green
      columnStyles: {
        0: { fillColor: [215, 228, 189] },
        // etc
      },
      startY: firstTable,
      bodyStyles: {
        fontSize: 7.5,
        //lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      pageBreak: 'auto',
      tableWidth: 'auto',
      didParseCell: (data) => {
        data.cell.styles.fillColor = [183, 222, 232];
      },
      body: tablaContacto,
      didDrawCell: (data) => {
        if (data.column.index === 0 && data.cell.section === 'body') {
          const columnWidth = data.table.columns[0].width;
          data.doc.line(
            data.cursor.x + columnWidth,
            data.cursor.y + data.row.height,
            data.cursor.x,
            data.cursor.y + data.row.height
          );
          data.doc.line(
            data.cursor.x,
            data.cursor.y + data.row.height,
            data.cursor.x,
            data.cursor.y
          );
          data.doc.line(
            data.cursor.x + columnWidth,
            data.cursor.y,
            data.cursor.x,
            data.cursor.y
          );
        }
        if (data.column.index === 1 && data.cell.section === 'body') {
          const columnWidth2 = data.table.columns[1].width;
          data.doc.line(
            data.cursor.x + columnWidth2,
            data.cursor.y + data.row.height,
            data.cursor.x,
            data.cursor.y + data.row.height
          );
          data.doc.line(
            data.cursor.x + columnWidth2,
            data.cursor.y + data.row.height,
            data.cursor.x + columnWidth2,
            data.cursor.y
          );
          data.doc.line(
            data.cursor.x + columnWidth2,
            data.cursor.y,
            data.cursor.x,
            data.cursor.y
          );
        }
      },
    });
    doc.autoTable({
      styles: { fillColor: [255, 0, 0] },
      //columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } }, // Cells in first column centered and green
      headStyles: {
        fillColor: [167, 168, 167],
        fontSize: 8,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      bodyStyles: {
        fontSize: 7.5,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 23 },
        1: { cellWidth: 20 },
        2: { cellWidth: 58, halign: 'left' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' },
        // etc
      },
      pageBreak: 'auto',
      tableWidth: 'auto',
      head: [
        [
          'CODIGO-PROV',
          'CVE-SAT',
          'DESCRIPCIÓN',
          'UNIDAD',
          'CANTIDAD',
          'P. UNITARIO	',
          'TOTAL',
        ],
      ],
      body: [
        ...productos,
        [
          '',
          '',
          NumeroALetras(orden.total, {
            plural: 'PESOS',
            singular: 'PESO',
            centPlural: 'CENTAVOS',
            centSingular: 'CENTAVO',
          }),
        ],
        [],
      ],
      didParseCell: (data) => {
        //console.log(data);
        if (data.row.index !== 0) data.cell.styles.fillColor = [255, 255, 255];
      },
    });
    var firstTable2 = doc.lastAutoTable.finalY;
    doc.autoTable({
      startY: firstTable2,
      bodyStyles: {
        fontSize: 9,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        minCellHeight: 20,
      },
      columnStyles: {
        0: { cellWidth: 120, halign: 'center', valign: 'middle' },
        1: { cellWidth: 10 },
        2: { cellWidth: 51.8, fillColor: [0, 0, 0] },
        // etc
      },
      body: [[['Atentamente\n' + orden?.rfc_empleado?.nombre], [], []]],
      didDrawCell: (data) => {
        if (data.column.dataKey === 2 && data.cell.section === 'body') {
          console.log(data);
          doc.autoTable({
            styles: { halign: 'right', fontSize: 9, cellPadding: 1 },
            columnStyles: {
              0: { fillColor: [0, 0, 0] },
              1: { fillColor: [0, 0, 0] },
              // etc
            },
            headStyles: { textColor: [0, 0, 0] },
            bodyStyles: {
              fillColor: [0, 0, 0],
              textColor: [255, 255, 255],
              halign: 'right',
            },
            body: [
              ['', 'SUBTOTAL', `${formatPrice(orden.total - orden.iva)}`],
              ['16.00%', 'IVA', `${formatPrice(orden.iva)}`],
              ['', 'TOTAL', `${formatPrice(orden.total)}`],
            ],
            startY: data.cell.y + 2,
            startX: data.cell.x + 1,
            margin: { left: data.cell.x + data.cell.padding('left') },
            tableWidth: 'wrap',
            didParseCell: (data) => {
              data.cell.styles.fillColor = [0, 0, 0];
            },
          });
        }
      },
    });
    var firstTable3 = doc.lastAutoTable.finalY;
    doc.autoTable({
      startY: firstTable3,
      bodyStyles: {
        fontSize: 9,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
      },
      columnStyles: {
        0: { cellWidth: 23 },
        1: { cellWidth: 120 },
        2: { cellWidth: 38.8 },
        // etc
      },
      body: [[['Nota:'], [+orden?.nota !== null ? orden?.nota : ''], []]],
    });
    doc.save(`orden_${orden.folio}.pdf`);
  };

  return (
    <>
      <Modal
        title={`Folio. ${orden?.folio}`}
        centered
        visible={visible}
        onOk={() => {
          setVis();
        }}
        onCancel={() => {
          setVis();
        }}
        width={'85%'}
        footer={[
          <Button
            key='submit'
            type='primary'
            onClick={() => {
              setVis();
            }}
          >
            Confirmar
          </Button>,
        ]}
      >
        <Row
          key='Row1'
          gutter={[16, 24]}
          style={{ marginBottom: '10px', width: '100%' }}
          align='middle'
          justify='center'
        >
          <Col className='gutter-row' key='col1' span={12}>
            <TextLabel
              title='RFC Proveedor'
              subtitle={orden?.rfc_proveedor?.rfc}
            />

            {orden?.rfc_proveedor?.correo !== null ? (
              <TextLabel
                title='Correo Electrónico'
                subtitle={orden?.rfc_proveedor?.correo}
              />
            ) : null}
            <TextLabel
              title='Fecha de Creación'
              subtitle={moment(new Date(orden?.fecha_creacion)).format(
                formatoFecha
              )}
            />
          </Col>
          <Col className='gutter-row' key='col2' span={12}>
            <TextLabel
              title='Razón Social'
              subtitle={orden?.rfc_proveedor?.razon_social}
            />
            <TextLabel
              title='Teléfono'
              subtitle={orden?.rfc_proveedor?.telefono}
            />
            {orden?.rfc_proveedor?.whatsapp !== null ? (
              <TextLabel
                title='Whatsapp'
                subtitle={orden?.rfc_proveedor?.whatsapp}
              />
            ) : null}
          </Col>
        </Row>
        {orden?.nota !== null ? (
          <TextLabel title='Nota' subtitle={orden.nota} />
        ) : null}
        <TextLabel title='RFC Empleado' subtitle={orden?.rfc_empleado?.rfc} />
        <TextLabel title='Productos' />
        <Table
          columnWidth='10px'
          bordered
          //   scroll={{ x: 1500, y: 600 }}
          dataSource={lista}
          columns={mergedColumns}
          rowClassName='editable-row'
          /*pagination={{
          onChange: cancel,
        }}*/
        />
        <Row
          key='Row2'
          gutter={[16, 24]}
          style={{ marginBottom: '10px', width: '100%' }}
          align='middle'
          justify='center'
        >
          <Col className='gutter-row' key='col21' span={8}>
            <TextLabel title='SUBTOTAL' subtitle={orden.total - orden.iva} />
          </Col>
          <Col className='gutter-row' span={8} key='col22'>
            <TextLabel title='IVA' subtitle={orden.iva} />
          </Col>
          <Col className='gutter-row' span={8} key='col23'>
            <TextLabel title='TOTAL' subtitle={orden.total} />
          </Col>
        </Row>
        <Button
          type='link'
          onClick={() => {
            generarPDF();
          }}
          size='large'
        >
          Generar PDF
        </Button>
      </Modal>
    </>
  );
};

export default Index;
