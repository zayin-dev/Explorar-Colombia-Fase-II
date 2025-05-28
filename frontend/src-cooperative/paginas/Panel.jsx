import React, { useState } from "react";
import Modal from "react-modal";
import MapaColombia from "../componentes/MapaColombia";
import { infoRegiones } from "../datos/InfoRegiones"; // Importa infoRegiones

Modal.setAppElement("#root");

const Panel = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [regionSeleccionada, setRegionSeleccionada] = useState("");

  const handleRegionClick = (region) => {
    // Normaliza el nombre del departamento reemplazando espacios por guiones bajos
    const normalizedRegion = region.replace(/ /g, "_");
    setRegionSeleccionada(normalizedRegion);
    setModalIsOpen(true);
  };

  const closeModal = () => setModalIsOpen(false);

  const info = infoRegiones[regionSeleccionada] || {
    descripcion: "No hay información disponible.",
    imagen: null,
    datosClave: [],
  };

  return (
    <div>
      <MapaColombia onRegionClick={handleRegionClick} />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Información Turística"
        style={{
          content: {
            maxWidth: "500px",
            margin: "auto",
            padding: "2rem",
            borderRadius: "12px",
          },
        }}
      >
        <h2>{regionSeleccionada.replace(/_/g, " ")}</h2> {/* Muestra el nombre con espacios */}
        <p>{info.descripcion}</p>
        {info.imagen && (
          <img
            src={info.imagen}
            alt={`Paisaje de ${regionSeleccionada}`}
            style={{ width: "100%", borderRadius: "8px", marginTop: "1rem" }}
          />
        )}
        {info.datosClave.length > 0 && (
          <ul style={{ textAlign: "left", marginTop: "1rem" }}>
            {info.datosClave.map((dato, i) => (
              <li key={i}>{dato}</li>
            ))}
          </ul>
        )}
        <button onClick={closeModal} style={{ marginTop: "1.5rem" }}>
          Cerrar
        </button>
      </Modal>
    </div>
  );
};

export default Panel;