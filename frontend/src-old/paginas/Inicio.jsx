// src/paginas/Inicio.jsx
import { Container, Row, Col, Card, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import Carrusel from '../componentes/Carrusel';
import FormularioConCollapse from '../componentes/FormularioConCollapse';
import Feria from '../imagenes/Foto_Feria.jpg';
import Festival from '../imagenes/Foto_Festival.webp';
import Libro from '../imagenes/Foto_libro.png';

function Inicio() {
  // Popovers definidos como constantes
  const popoverFeria = (
    <Popover id="popover-feria">
      <Popover.Header as="h3">Feria de las Flores</Popover.Header>
      <Popover.Body>
        Se celebra en Medellín entre julio y agosto con eventos llenos de tradición paisa. Para mas infomacion da click en la imagen
      </Popover.Body>
    </Popover>
  );

  const popoverFestival = (
    <Popover id="popover-festival">
      <Popover.Header as="h3">Festival Vallenato</Popover.Header>
      <Popover.Body>
        Un homenaje a los juglares del vallenato que se realiza en Valledupar del 30 de abril al 3 de mayo. Para mas informacion da click en la imagen
      </Popover.Body>
    </Popover>
  );

  const popoverLibro = (
    <Popover id="popover-libro">
      <Popover.Header as="h3">Feria del Libro</Popover.Header>
      <Popover.Body>
        Bogotá se llena de literatura, cultura y conocimiento durante este evento desde el 25 de abril hasta el 11 de mayo.
        Para mas informacion da click en la imagen
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <div className="carrusel-wrapper">
        <Carrusel />
      </div>

      <Container className="mt-4 text-center">
        <h1 className="mb-4">Bienvenido a Explora Colombia</h1>
        <h2>Eventos próximos</h2>
        <Row className="mt-5">
          <Col xs={12} md={4}>
            <h3>Feria de las flores</h3>
            <a href="https://visitarmedellin.com/programacion-feria-de-las-flores/" target="_blank" rel="noopener noreferrer">
              <img
                src={Feria}
                alt="Feria de las flores Medellín"
                style={{ width: '80%', height: 'auto', borderRadius: '15px', marginBottom: '1rem' }}
              />
            </a>
            <p>
              <span style={{ fontSize: '20px', color: 'black' }}>
                Una de las festividades más emblemáticas de Colombia, donde se destacan los desfiles de silleteros, conciertos, exposiciones florales y eventos culturales que celebran la identidad paisa.
              </span>
            </p>
            <OverlayTrigger trigger="click" placement="bottom" overlay={popoverFeria} rootClose>
              <Button variant="secondary">Más info</Button>
            </OverlayTrigger>
          </Col>

          <Col xs={12} md={4}>
            <h3>Festival Vallenato</h3>
            <a href="https://festivalvallenato.com/" target="_blank" rel="noopener noreferrer">
              <img
                src={Festival}
                alt="Festival Vallenato"
                style={{ width: '80%', height: 'auto', borderRadius: '15px', marginBottom: '1rem' }}
              />
            </a>
            <p>
              <span style={{ fontSize: '20px', color: 'black' }}>
                Este festival es el epicentro de la música vallenata, donde se rinde homenaje a los juglares y se celebran concursos de acordeoneros, piquerías y compositores.
              </span>
            </p>
            <OverlayTrigger trigger="click" placement="bottom" overlay={popoverFestival} rootClose>
              <Button variant="secondary">Más info</Button>
            </OverlayTrigger>
          </Col>

          <Col xs={12} md={4}>
            <h3>Feria internacional del libro</h3>
            <a href="https://feriadellibro.com/" target="_blank" rel="noopener noreferrer">
              <img
                src={Libro}
                alt="Festival Internacional del libro"
                style={{ width: '80%', height: 'auto', borderRadius: '15px', marginBottom: '1rem' }}
              />
            </a>
            <p>
              <span style={{ fontSize: '20px', color: 'black' }}>
                Uno de los eventos literarios más importantes de América Latina, que reúne a escritores, editoriales y lectores en una celebración de la literatura y la cultura.
              </span>
            </p>
            <OverlayTrigger trigger="click" placement="bottom" overlay={popoverLibro} rootClose>
              <Button variant="secondary">Más info</Button>
            </OverlayTrigger>
          </Col>
        </Row>

        {/* Formulario */}
        <Row className="justify-content-center mt-5">
          <Col xs={12} md={10} lg={8}>
            <Card className="p-4 shadow-lg rounded-4">
              <h2 className="text-center mb-4">Formulario de Registro</h2>
              <FormularioConCollapse />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Inicio;
