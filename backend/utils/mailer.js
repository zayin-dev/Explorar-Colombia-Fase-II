const nodemailer = require('nodemailer'); // Biblioteca para el envío de correos electrónicos en Node.js

// --- VARIABLES GLOBALES DEL MÓDULO --- //
let transporter; // Almacenará la instancia del transportador de Nodemailer una vez inicializado.
let etherealTestAccount; // Almacenará los detalles de la cuenta de prueba de Ethereal.

// --- FUNCIÓN: initializeMailer --- //
/**
 * @async
 * @function initializeMailer
 * @description Inicializa el transportador de Nodemailer utilizando una cuenta de prueba de Ethereal.
 * Ethereal es un servicio que simula el envío de correos sin enviarlos realmente,
 * proporcionando una URL para previsualizar el correo enviado. Ideal para desarrollo y pruebas.
 * Esta función se llama automáticamente cuando se carga el módulo.
 */
async function initializeMailer() {
    // Si el transportador ya está inicializado, no hacer nada.
    if (transporter) {
        console.log('Nodemailer (Ethereal) ya está inicializado.');
        return;
    }

    try {
        // Crea una cuenta de prueba en Ethereal. Esto es asíncrono.
        etherealTestAccount = await nodemailer.createTestAccount();
        
        // Muestra las credenciales de la cuenta de Ethereal en la consola.
        // Estas credenciales son temporales y solo para pruebas.
        console.log('--------------------------------------------------------------------');
        console.log('Cuenta de Prueba Ethereal CREADA (para enviar correos de reseteo de contraseña):');
        console.log('Usuario (User): %s', etherealTestAccount.user);
        console.log('Contraseña (Password): %s', etherealTestAccount.pass);
        console.log('Host SMTP: smtp.ethereal.email');
        console.log('Puerto SMTP: 587');
        console.log('NOTA: Estas credenciales son para una cuenta de prueba. Los correos no se envían realmente, pero se pueden previsualizar.');
        console.log('URL general de previsualización: https://ethereal.email/messages');
        console.log('--------------------------------------------------------------------');

        // Configura el transportador de Nodemailer con los detalles de la cuenta Ethereal.
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email', // Host SMTP de Ethereal
            port: 587,                   // Puerto SMTP (587 para TLS, 465 para SSL)
            secure: false,               // `false` para TLS (puerto 587), `true` para SSL (puerto 465)
            auth: {
                user: etherealTestAccount.user, // Usuario generado por Ethereal
                pass: etherealTestAccount.pass, // Contraseña generada por Ethereal
            },
        });
        console.log('Transportador Nodemailer Ethereal configurado exitosamente.');
    } catch (error) {
        console.error('Fallo al crear la cuenta de prueba Ethereal o el transportador:', error);
        // En una aplicación real, podrías querer lanzar este error o manejarlo de forma más robusta.
    }
}

// --- FUNCIÓN: sendEmail --- //
/**
 * @async
 * @function sendEmail
 * @description Envía un correo electrónico utilizando el transportador configurado.
 * Si el transportador no está inicializado, intenta inicializarlo primero.
 * @param {object} mailDetails - Objeto con los detalles del correo.
 * @param {string} mailDetails.to - Dirección(es) de correo del destinatario(s).
 * @param {string} mailDetails.subject - Asunto del correo.
 * @param {string} mailDetails.text - Cuerpo del correo en texto plano.
 * @param {string} [mailDetails.html] - Cuerpo del correo en formato HTML (opcional).
 * @returns {Promise<object>} Promesa que resuelve a un objeto con `messageId` y `previewUrl` del correo enviado.
 * @throws {Error} Si el mailer no está inicializado o si ocurre un error durante el envío.
 */
const sendEmail = async ({ to, subject, text, html }) => {
    // Verifica si el transportador está inicializado.
    if (!transporter) {
        // Intenta inicializar si no se ha hecho. Esto lo hace más robusto
        // si `initializeMailer` no fue llamado explícitamente al inicio.
        console.log('Mailer no inicializado. Intentando inicializar ahora...');
        await initializeMailer();
        // Vuelve a verificar después del intento de inicialización.
        if (!transporter) { 
            console.error('Falló la inicialización del Mailer. No se puede enviar el correo.');
            throw new Error('El Mailer no está inicializado. Revisa la consola para errores de configuración de Ethereal.');
        }
    }

    try {
        // Define las opciones del correo.
        const mailOptions = {
            // Dirección del remitente. Para Ethereal, se usa el usuario de la cuenta de prueba.
            from: `"Sistema WebApp" <${etherealTestAccount.user}>`,
            to: to,             // Lista de destinatarios (ej. "usuario1@example.com, usuario2@example.com")
            subject: subject,   // Asunto del correo
            text: text,         // Cuerpo en texto plano
            html: html,         // Cuerpo en HTML (opcional)
        };

        // Envía el correo utilizando el transportador.
        let info = await transporter.sendMail(mailOptions);

        console.log('Mensaje enviado vía Ethereal: %s', info.messageId);
        // La URL de previsualización se mostrará en la consola.
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('URL de previsualización para este correo: %s', previewUrl);
        
        // Devuelve el ID del mensaje y la URL de previsualización.
        return { messageId: info.messageId, previewUrl };
    } catch (error) {
        console.error('Error enviando correo vía Ethereal:', error);
        throw error; // Relanza el error para que sea manejado por quien llamó a la función.
    }
};

// --- INICIALIZACIÓN AUTOMÁTICA --- //
// Llama a `initializeMailer` inmediatamente cuando este módulo es cargado (importado).
// Esto asegura que la cuenta de Ethereal y el transportador estén listos (o intenten estarlo)
// tan pronto como sea posible, para cuando se llame a `sendEmail`.
(async () => {
    await initializeMailer();
})();

// Exporta la función `sendEmail` para que pueda ser utilizada en otras partes de la aplicación.
module.exports = {
    sendEmail,
    // initializeMailer // Opcionalmente se podría exportar si se necesita reinicializar o verificar estado desde otro lugar.
};
