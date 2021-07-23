import { Modal, Button, Row, Col, Table } from 'antd';
import TextLabel from '../../UI/TextLabel';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useState, useEffect } from 'react';
import { NumeroALetras } from 'api/numeroTexto';
import logo from 'utils/Cotizacion.png';
import moment from 'moment';

const formatoFechaHora = 'DD MMMM YYYY, hh:mm:ss a';
const formatoFecha = 'DD MMMM YYYY';

const Index = ({ visible, cotizacion, setVis }) => {
  const [lista, setlista] = useState([]);

  const formatPrice = (price) => {
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return formatter.format(price);
  };

  useEffect(() => {
    let productos = [];
    cotizacion?.productos_cotizados?.forEach((producto, index) => {
      productos.push({ ...producto, key: index });
    });
    onSetLista(productos);
  }, [cotizacion]);

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
      title: 'CVE',
      dataIndex: 'clave',
      width: '20px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'NOMBRE',
      dataIndex: 'descripcion',
      width: '60px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'UNIDAD',
      dataIndex: 'clave_unidad',
      width: '20px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'PRECIO UNI.',
      dataIndex: 'precio_unitario',
      width: '30px',
      //fixed: 'left',
      ellipsis: true,
    },
    {
      title: 'CANTIDAD',
      dataIndex: 'cantidad',
      width: '30px',
      editable: false,
    },

    {
      title: 'IVA',
      dataIndex: 'iva',
      width: '20px',
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'DESCUENTO',
      dataIndex: 'descuento',
      width: '20px',
      max: 3,
      //fixed: 'left',
      ellipsis: true,
      editable: false,
    },
    {
      title: 'TOTAL',
      dataIndex: 'total',
      width: '20px',
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
          inputType: typeColumn(col.type),
          dataIndex: col.dataIndex,
          title: col.title,
        }),
      };
    } else return col;
  });

  const generarPDF = () => {
    const doc = new jsPDF();
    const productos = [];
    console.log(cotizacion);
    cotizacion?.productos_cotizados.forEach((producto) => {
      productos.push([
        producto.clave,
        producto.descripcion,
        producto.clave_unidad,
        formatPrice(producto.precio_unitario),
        producto.cantidad,
        producto.iva + ' %',
        producto.descuento + ' %',
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
            'TEL.- (612)12-58699 CEL.- (612)3489216 email:maph666@gmail.com',
            data.cursor.x + columnWidth / 3 - 0.5,
            data.cursor.y + 10.0
          );
          doc.setFont('Broadway');
          doc.setFontSize(14.3);
          doc.setTextColor(36, 64, 98);
          doc.text(
            `COTIZACIÓ  N: ${cotizacion.folio}`,
            data.cursor.x + columnWidth / 2.2,
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
            `${cotizacion.fecha_creacion.substring(0, 10)}`,
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
    doc.autoTable({
      //columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } }, // Cells in first column centered and green
      columnStyles: {
        0: { fillColor: [215, 228, 189] },
        // etc
      },
      startY: firstTable,
      bodyStyles: {
        fontSize: 7.5,
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        minCellHeight: 20,
      },
      pageBreak: 'auto',
      tableWidth: 'auto',
      body: [['']],
      didDrawCell: (data) => {
        if (data.column.index === 0 && data.cell.section === 'body') {
          //
          doc.setFont('Courier-Bold');
          doc.setFontSize(10.2);
          doc.setTextColor(0, 0, 0);
          doc.text(
            `Atención a: ${cotizacion.nombre_cliente}`,
            data.cursor.x + 2,
            data.cursor.y + 5
          );
          doc.setFontSize(9.2);
          doc.text(
            `Concepto: ${cotizacion.concepto}`,
            data.cursor.x + 2,
            data.cursor.y + data.row.height / 2 + 5
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
        0: { cellWidth: 15, halign: 'left' },
        1: { halign: 'left', cellWidth: 60 },
        2: { halign: 'left' },
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' },
        7: { halign: 'right' },
        // etc
      },
      pageBreak: 'auto',
      tableWidth: 'auto',
      head: [
        [
          'CVE',
          'NOMBRE',
          'UNIDAD',
          'PRECIO UNI',
          'CANTIDAD',
          'IVA',
          'DESCUENTO',
          'TOTAL',
        ],
      ],
      body: [
        ...productos,
        [],
        [
          [],
          [
            `Fecha de vigencia de la cotizacion ${cotizacion.fecha_vigencia.replace(
              'T00:00:00',
              ''
            )}`,
          ],
        ],
        [
          [],
          [`Se requiere un anticipo de ${cotizacion.porcentaje_anticipo} %`],
        ],
        [[], [`Tiempo de entrega ${cotizacion.dias_entrega} días`]],
        [],
        [
          '',
          NumeroALetras(cotizacion.total, {
            plural: 'PESOS',
            singular: 'PESO',
            centPlural: 'CENTAVOS',
            centSingular: 'CENTAVO',
          }),
        ],
        [],
        [],
      ],
      didParseCell: (data) => {
        //console.log(data);
        if (data.row.index !== 0) data.cell.styles.fillColor = [255, 255, 255];
        if (data.row.index === cotizacion?.productos_cotizados.length + 7) {
          data.cell.styles.fillColor = [255, 255, 128]; //128
        }
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
      body: [[['Atentamente\n' + cotizacion?.rfc_empleado?.nombre], [], []]],
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
              ['SUBTOTAL', `${formatPrice(cotizacion.total - cotizacion.iva)}`],
              ['IVA', `${formatPrice(cotizacion.iva)}`],
              ['TOTAL', `${formatPrice(cotizacion.total)}`],
            ],
            startY: data.cell.y + 2,
            startX: data.cell.x + 1,
            margin: { left: data.cell.x + data.cell.padding('left') },
            tableWidth: 'wrap',
          });
        }
      },
    });
    doc.save(`Cotizacion_${cotizacion.folio}.pdf`);
  };

  return (
    <>
      <Modal
        title={`Folio. ${cotizacion.folio}`}
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
        <TextLabel title='Concepto' subtitle={cotizacion.concepto} />
        {cotizacion?.id_cliente?.length !== 0 ? (
          <TextLabel title='Id Cliente' subtitle={cotizacion.id_cliente} />
        ) : null}
        <Row
          key='Row1'
          gutter={[16, 24]}
          style={{ marginBottom: '10px', width: '100%' }}
          align='middle'
          justify='center'
        >
          <Col className='gutter-row' key='col1' span={12}>
            <TextLabel
              title='Nombre del Cliente'
              subtitle={cotizacion.nombre_cliente}
            />
            <TextLabel
              title='Correo Electrónico'
              subtitle={cotizacion.email_cliente}
            />
            <TextLabel
              title='Fecha de Creación'
              subtitle={moment(new Date(cotizacion.fecha_creacion)).format(
                formatoFechaHora
              )}
            />
            <TextLabel
              title='Porcentaje de Anticipo'
              subtitle={cotizacion.porcentaje_anticipo}
            />
          </Col>
          <Col className='gutter-row' key='col2' span={12}>
            <TextLabel
              title='Teléfono'
              subtitle={cotizacion.telefono_cliente}
            />
            <TextLabel title='Razón Social' subtitle={cotizacion.empresa} />
            <TextLabel
              title='Fecha de Vigencia'
              subtitle={moment(cotizacion.fecha_vigencia).format(formatoFecha)}
            />
            <TextLabel
              title='Días de Entrega'
              subtitle={cotizacion.dias_entrega}
            />
          </Col>
        </Row>
        {cotizacion?.nota !== null ? (
          <TextLabel title='Nota' subtitle={cotizacion.nota} />
        ) : null}
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
            <TextLabel
              title='SUBTOTAL'
              subtitle={`${formatPrice(
                (cotizacion.total - cotizacion.iva).toFixed(2)
              )}`}
            />
          </Col>
          <Col className='gutter-row' span={8} key='col22'>
            <TextLabel
              title='IVA'
              subtitle={`${formatPrice(cotizacion.iva)}`}
            />
          </Col>
          <Col className='gutter-row' span={8} key='col23'>
            <TextLabel
              title='TOTAL'
              subtitle={`${formatPrice(cotizacion.total)}`}
            />
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
