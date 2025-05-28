import React, { useState, useEffect } from "react";
import "../estilos/ChatBot.css";
import { infoRegiones } from "../datos/InfoRegiones"; // Importa infoRegiones

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        { text: "¡Hola! Bienvenido a nuestro sitio.", sender: "bot" },
        { text: "¿En qué departamento estás interesado?", sender: "bot" },
      ]);
    }
  }, [isOpen]);

  const handleDepartmentClick = (department) => {
    const regionInfo = infoRegiones[department];

    const response = regionInfo
      ? `Información sobre ${department.replace(/_/g, " ")}: ${regionInfo.descripcion}`
      : "Lo siento, no tengo información sobre ese departamento.";

    const botMessage = { text: response, sender: "bot" };
    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : "closed"}`}>
      {/* Botón para abrir/cerrar el chatbot */}
      <div className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "Cerrar Chat" : "Abrir Chat"}
      </div>

      {/* Contenido del chatbot (visible solo si está abierto) */}
      {isOpen && (
        <div className="chatbot">
          <div className="chatbot-header">Chatbot</div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${
                  msg.sender === "user" ? "user" : "bot"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Contenedor con scroll para los botones de departamentos */}
          <div className="chatbot-departments-container">
            <div className="chatbot-departments">
              {Object.keys(infoRegiones).map((department, index) => (
                <button
                  key={index}
                  onClick={() => handleDepartmentClick(department)}
                  className="chatbot-department-button"
                >
                  {department.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;