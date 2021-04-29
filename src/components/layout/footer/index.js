import './style.css';
import { Layout, Typography, Card, Image } from 'antd';
const { Footer } = Layout;
const { Link, Text } = Typography;

const gridStyle = {
  width: '50%',
  textAlign: 'center',
};

const gridStyle2 = {
  width: '100%',
  textAlign: 'left',
};

const Index = () => {
  return (
    <Footer>
      <div style={{ float: 'left', width: 300, position: 'flex' }}>
        <Card.Grid size="small" hoverable={false} style={gridStyle}>
          <Link>Inicio</Link>
        </Card.Grid>
        <Card.Grid size="small" hoverable={false} style={gridStyle}>
          <Link>Facturación</Link>
        </Card.Grid>
        <Card.Grid size="small" hoverable={false} style={gridStyle}>
          <Link>Categorias</Link>
        </Card.Grid>
        <Card.Grid size="small" hoverable={false} style={gridStyle}>
          <Link>Aviso Legal</Link>
        </Card.Grid>
        <Card.Grid size="small" hoverable={false} style={gridStyle}>
          <Link>Perfil</Link>
        </Card.Grid>
        <Card.Grid size="small" hoverable={false} style={gridStyle}>
          <Link>Términos y condiciones</Link>
        </Card.Grid>
      </div>
      <div
        style={{
          float: 'left',
          position: 'flex',
          marginLeft: '25%',
        }}
      >
        <Image
          width={200}
          preview={false}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
        <br />
        <Text style={{ textAlign: 'center' }}>Kernel System © 2021</Text>
      </div>
      <div style={{ float: 'right', width: 300, position: 'flex' }}>
        <Card.Grid size="small" hoverable={false} style={gridStyle2}>
          <Link>Inicio</Link>
        </Card.Grid>
        <Card.Grid size="small" hoverable={false} style={gridStyle2}>
          <Link>Facturación</Link>
        </Card.Grid>
        <Card.Grid size="small" hoverable={false} style={gridStyle2}>
          <Link>Categorias</Link>
        </Card.Grid>
      </div>
    </Footer>
  );
};

/*
        <Link href="https://ant.design" target="_blank">
          Ant Design (Link)
        </Link>
*/

export default Index;
