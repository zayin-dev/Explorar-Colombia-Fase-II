import '../estilos/footer.css';
import { useState } from 'react';
import Edwin from '../imagenes/Edwin.jpg';
import Sara from '../imagenes/Sara.jpeg';
import Juan from '../imagenes/Juan.jpg';
import Thomas from '../imagenes/Thomas.webp';


function Footer() {
  const [mostrarModal, setMostrarModal] = useState(false);

  const miembros = [
    {
      nombre: "Edwin Gutierrez",
      correo: "Edwin.Gutierrez@gmail.com",
      foto: Edwin,
      instagram: "https://www.instagram.com/edwin_gutierrez/",
      facebook: "https://www.facebook.com/edwingutierrez/",
      linkedin: "https://www.linkedin.com/in/edwin-gutierrez/",
    },
    {
      nombre: "Sara Sofia",
      correo: "Sara.Sofia@gmail.com",
      foto: Sara,
      instagram: "https://www.instagram.com/sarasofia/",
      facebook: "https://www.facebook.com/sarasofia/",
      linkedin: "https://www.linkedin.com/in/sara-sofia/",
    },
    {
      nombre: "Juan Vides",
      correo: "Juan.Vides@gmail.com",
      foto: Juan,
      instagram: "https://www.instagram.com/juanvides/",
      facebook: "https://www.facebook.com/juanvides/",
      linkedin: "https://www.linkedin.com/in/juan-vides/",
    },
    {
      nombre: "Thomas",
      correo: "Thomas.rodriguez@gmail.com",
      foto: Thomas,
      instagram: "https://www.instagram.com/thomasrodriguez/",
      facebook: "https://www.facebook.com/thomasrodriguez/",
      linkedin: "https://www.linkedin.com/in/thomas-rodriguez/",
    }
  ];

  return (
    <>
      <footer className="bg-dark text-white text-center py-4 mt-5">
        <p>© 2025 Explorar Colombia - Todos los derechos reservados.</p>
        <p>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a> |
          <a href="https://twitter.com" target="_blank" rel="noreferrer"> Twitter</a> |
          <a href="https://instagram.com" target="_blank" rel="noreferrer"> Instagram</a> |
          <a href="https://linkedin.com" target="_blank" rel="noreferrer"> LinkedIn</a>
        </p>
        <button className="btn-contacto mt-3" onClick={() => setMostrarModal(true)}>Contáctenos</button>
      </footer>

      {mostrarModal && (
        <div id='modal-backdrop' onClick={() => setMostrarModal(false)}>
          <div id='modal-content' onClick={(e) => e.stopPropagation()}>
            <h2 id='titulo-modal'>Miembros del equipo</h2>
            <div className="row justify-content-center">
              {miembros.map((miembro, index) => (
                <div key={index} className="col-md-3 text-center miembro-card">
                  <img src={miembro.foto} alt={miembro.nombre} className="miembro-foto" />
                  <h4 id='nombre-miembro'>{miembro.nombre}</h4>
                  <p id='info-miembro'>{miembro.correo}</p>
                  <div className="redes-sociales-lista">
                    {miembro.instagram && (
                      <a href={miembro.instagram} target="_blank" rel="noopener noreferrer" className="red-social-link">
                        Instagram
                      </a>
                    )}
                    {miembro.facebook && (
                      <a href={miembro.facebook} target="_blank" rel="noopener noreferrer" className="red-social-link">
                        Facebook
                      </a>
                    )}
                    {miembro.linkedin && (
                      <a href={miembro.linkedin} target="_blank" rel="noopener noreferrer" className="red-social-link">
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-cerrar mt-3" onClick={() => setMostrarModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;