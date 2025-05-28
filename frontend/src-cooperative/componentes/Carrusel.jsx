import { Carousel } from 'react-bootstrap';
import Cartagena from '../imagenes/Foto_cartagena.jpg';
import Medellin from '../imagenes/Foto_medellin.jpg'; 
import Tayrona from '../imagenes/Foto_Tayrona.jpg';
import Eje_cafetero from '../imagenes/Foto_eje_cafetero.jpg';
import Guatape from '../imagenes/Foto_guatape.jpg';
import '../estilos/Carrusel.css';

function Carrusel() {
  return (
    <Carousel fade interval={2000} className="carousel">
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={Cartagena}
          alt="Cartagena"
        
        />
        <Carousel.Caption>
          <h5 className="text-dark bg-light p-2 rounded">Cartagena</h5>
          <p className="text-dark bg-light p-2 rounded">"Una joya del Caribe Colombiano".</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={Medellin}
          alt="Medellin"
         
        />
        <Carousel.Caption>
          <h5 className="text-dark bg-light p-2 rounded">Medellín</h5>
          <p className="text-dark bg-light p-2 rounded">"La ciudad de la eterna primavera".</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={Tayrona}
          alt="Tayrona"
        />
        <Carousel.Caption>
          <h5 className="text-dark bg-light p-2 rounded">Tayrona</h5>
          <p className="text-dark bg-light p-2 rounded">"Un santuario donde la selva se encuentra con el mar".</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={Eje_cafetero}
          alt="Eje Cafetero"
        />
        <Carousel.Caption>
          <h5 className="text-dark bg-light p-2 rounded">Eje Cafetero</h5>
          <p className="text-dark bg-light p-2 rounded">"El Eje Cafetero, donde nace el sabor y la tradición de Colombia.".</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={Guatape}
          alt="Guatape"
        />
        <Carousel.Caption>
          <h5 className="text-dark bg-light p-2 rounded">Guatapé</h5>
          <p className="text-dark bg-light p-2 rounded">"Un bello pueblo antioqueño"</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Carrusel;
