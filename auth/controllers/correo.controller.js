/*"use strict";
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSMAIL,
  },
});

async function sendRecoveryEmailWithCode(user, verificationCode) {
    const mailOptions = {
      from: '"Pastelería Austin\'s" <austins0271142@gmail.com>',
      to: user.email,
      subject: 'Recuperación de Contraseña - Pastelería Austin\'s',
      html: `
        <div style="background-color: #f5f5f5; padding: 20px; font-family: 'Arial', sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; padding: 20px;">
              <img src="https://static.wixstatic.com/media/64de7c_4d76bd81efd44bb4a32757eadf78d898~mv2_d_1765_2028_s_2.png" alt="Austin's Logo" style="max-width: 100px;">
            </div>
            <div style="text-align: center; padding: 20px;">
              <h2 style="font-size: 24px; color: #333;">Recuperación de Contraseña</h2>
              <p style="color: #555; font-size: 16px;">Hemos recibido una solicitud para restablecer tu contraseña. Utiliza el siguiente código para completar el proceso:</p>
              <p style="font-size: 32px; color: #ff5733; font-weight: bold;">${verificationCode}</p>
            </div>
            <p style="text-align: center; color: #777; font-size: 14px;">Si no has solicitado este cambio, por favor ignora este correo electrónico.</p>
          </div>
        </div>
      `,
    };
  
    await transporter.sendMail(mailOptions);
  }
*/
/*"use strict";
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSMAIL,
  },
});

async function sendRecoveryEmailWithCode(user, verificationCode) {
    const mailOptions = {
      from: '"Pastelería Austin\'s" <austins0271142@gmail.com>',
      to: user.email,
      subject: 'Recuperación de Contraseña - Pastelería Austin\'s',
      html: `
        <div style="background-color: #f5f5f5; padding: 20px; font-family: 'Arial', sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; padding: 20px;">
              <img src="https://static.wixstatic.com/media/64de7c_4d76bd81efd44bb4a32757eadf78d898~mv2_d_1765_2028_s_2.png" alt="Austin's Logo" style="max-width: 100px;">
            </div>
            <div style="text-align: center; padding: 20px;">
              <h2 style="font-size: 24px; color: #333;">Recuperación de Contraseña</h2>
              <p style="color: #555; font-size: 16px;">Hemos recibido una solicitud para restablecer tu contraseña. Utiliza el siguiente código para completar el proceso:</p>
              <p style="font-size: 32px; color: #ff5733; font-weight: bold;">${verificationCode}</p>
            </div>
            <p style="text-align: center; color: #777; font-size: 14px;">Si no has solicitado este cambio, por favor ignora este correo electrónico.</p>
          </div>
        </div>
      `,
    };
  
    await transporter.sendMail(mailOptions);
  }
*/
"use strict";

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'quickdinehub@gmail.com', // Cambiar por tu dirección de correo electrónico
        pass: 'crqpsebcojympajd' // Cambiar por tu contraseña de correo electrónico
    }
});

function enviarCorreo(req, res) {
    const { email, codigo } = req.body;

    const mailOptions = {
        from: 'quickdinehub@gmail.com', // Cambiar por tu dirección de correo electrónico
        to: email,
        subject: 'Código de autenticación',
        html: `
      <div style="background-color: #f5f5f5; padding: 20px; font-family: 'Arial', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; padding: 20px;">
            <img src="https://qdh-interfazprueba.web.app/assets/logo.png" alt="Austin's Logo" style="max-width: 100px;">
          </div>
          <div style="text-align: center; padding: 20px;">
            <h2 style="font-size: 24px; color: #333;">Codigo de autenticación</h2>
            <p style="color: #555; font-size: 16px;">Hemos recibido una solicitud de registro. Utiliza el siguiente código para completar el proceso:</p>
            <p style="font-size: 32px; color: #ff5733; font-weight: bold;">${codigo}</p>
          </div>
          <p style="text-align: center; color: #777; font-size: 14px;">Si no has solicitado este proceso, por favor ignora este correo electrónico.</p>
        </div>
      </div>
    `,
        //text: `Tu código de autenticación es: ${codigo}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
            res.status(500).json({ error: 'Error al enviar el correo electrónico' });
        } else {
            console.log('Correo electrónico enviado:', info.response);
            res.status(200).json({ message: 'Correo electrónico enviado exitosamente' });
        }
    });
}
//ADVERTENCIA: MUCHOS INTENTOS FALLIDOS DE INICIO DE SESION
function enviarCorreoAdvertencia(req, res) {
    const { email } = req.body;

    const mailOptions = {
        from: 'quickdinehub@gmail.com', // Cambiar por tu dirección de correo electrónico
        to: email,
        subject: 'Advertencia:Intentos de acceso fallidos a su cuenta',
        html: `
      <div style="background-color: #f5f5f5; padding: 20px; font-family: 'Arial', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; padding: 20px;">
            <img src="https://qdh-interfazprueba.web.app/assets/logo.png" alt="Austin's Logo" style="max-width: 100px;">
          </div>
          <div style="text-align: center; padding: 20px;">
            <h2 style="font-size: 24px; color: #333;">Advertencia: Intentos de acceso fallidos a su cuenta</h2>
            <p style="color: #555; font-size: 16px;">Queremos informarle que hemos detectado varios intentos fallidos de acceso a su cuenta en nuestro sistema durante las últimas horas. Como medida de seguridad, le recomendamos encarecidamente que verifique su cuenta y asegúrese de que su contraseña sea segura y no esté comprometida.</p>
          </div>
          <p style="text-align: center; color: #777; font-size: 16px;">Si reconoce estos intentos de acceso fallidos como suyos, le sugerimos que revise sus credenciales y evite el acceso no autorizado a su cuenta. Si no reconoce estos intentos de acceso, le instamos a que cambie su contraseña inmediatamente y a que se ponga en contacto con nuestro equipo de soporte para obtener asistencia adicional.</p>
        </div>
      </div>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
            res.status(500).json({ error: 'Error al enviar el correo electrónico' });
        } else {
            console.log('Correo electrónico enviado:', info.response);
            res.status(200).json({ message: 'Correo electrónico enviado exitosamente' });
        }
    });
};

//AL RESTABLECER CONTRASEÑA
function enviarCorreBloqueo(req, res) {
    const { email } = req.body;

    const mailOptions = {
        from: 'quickdinehub@gmail.com', // Cambiar por tu dirección de correo electrónico
        to: email,
        subject: 'Asunto: Notificación de Bloqueo de Cuenta',
        html: `
  <div style="background-color: #f5f5f5; padding: 20px; font-family: 'Arial', sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; padding: 20px;">
        <img src="https://qdh-interfazprueba.web.app/assets/logo.png" alt="Austin's Logo" style="max-width: 100px;">
      </div>
      <div style="text-align: center; padding: 20px;">
        <h2 style="font-size: 24px; color: #333;">Asunto: Notificación de Bloqueo de Cuenta</h2>
        <p style="color: #555; font-size: 16px;">Lamentamos informarle que su cuenta ha sido bloqueada temporalmente debido a múltiples intentos fallidos de acceso. Esta medida de seguridad se ha tomado para proteger su información y prevenir accesos no autorizados a su cuenta.</p>
        </div>
      <p style="text-align: justify; color: #777; font-size: 16px;">Para desbloquear su cuenta, le recomendamos que siga los siguientes pasos:</p>
      <p style="text-align: justify; color: #777; font-size: 14px;">1. Cambie su contraseña: Le sugerimos que restablezca su contraseña de inmediato para garantizar la seguridad de su cuenta.</p>
      <p style="text-align: justify; color: #777; font-size: 14px;">2. Verificación de Seguridad: Si sospecha que su cuenta pudo haber sido comprometida, le recomendamos que realice una verificación de seguridad adicional para asegurarse de que su cuenta esté protegida.</p>
      <p style="text-align: justify; color: #777; font-size: 14px;">3. Contacte con Soporte: Si necesita ayuda adicional o tiene alguna pregunta, no dude en ponerse en contacto con nuestro equipo de soporte, quienes estarán encantados de ayudarlo a resolver cualquier problema relacionado con su cuenta.</p>
    
      </div>
  </div>
`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
            res.status(500).json({ error: 'Error al enviar el correo electrónico' });
        } else {
            console.log('Correo electrónico enviado:', info.response);
            res.status(200).json({ message: 'Correo electrónico enviado exitosamente' });
        }
    });
}

//AL RESTABLECER CONTRASEÑA
function enviarCorreRestablecimiento(req, res) {
    const { email } = req.body;

    const mailOptions = {
        from: 'quickdinehub@gmail.com', // Cambiar por tu dirección de correo electrónico
        to: email,
        subject: 'Asunto: Confirmación de Cambio de Contraseña',
        html: `
    <div style="background-color: #f5f5f5; padding: 20px; font-family: 'Arial', sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding: 20px;">
          <img src="https://qdh-interfazprueba.web.app/assets/logo.png" alt="Austin's Logo" style="max-width: 100px;">
        </div>
        <div style="text-align: center; padding: 20px;">
          <h2 style="font-size: 24px; color: #333;">Asunto: Confirmación de Cambio de Contraseña</h2>
          <p style="color: #555; font-size: 16px;">Le informamos que hemos recibido su solicitud para cambiar la contraseña de su cuenta en QuickDineHub. Se ha realizado con éxito el cambio de contraseña y su cuenta ahora está protegida con una nueva contraseña.</p>
          </div>
        <p style="text-align: center; color: #777; font-size: 16px;">Si usted no solicitó este cambio de contraseña o considera que su cuenta podría estar comprometida, le recomendamos que se ponga en contacto con nuestro equipo de soporte de inmediato para revisar la situación y tomar las medidas necesarias para proteger su cuenta.</p>
      </div>
    </div>
  `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
            res.status(500).json({ error: 'Error al enviar el correo electrónico' });
        } else {
            console.log('Correo electrónico enviado:', info.response);
            res.status(200).json({ message: 'Correo electrónico enviado exitosamente' });
        }
    });
}

function correocancelarproducto(req, res) {
    const { email, nombreCliente, nombreProducto } = req.body;

    const mailOptions = {
        from: 'quickdinehub@gmail.com', // Cambiar por tu dirección de correo electrónico
        to: email,
        subject: ' Notificación de Cancelación de producto',
        html: `
    <div style="background-color: #f5f5f5; padding: 20px; font-family: 'Arial', sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding: 20px;">
          <img src="https://qdh-interfazprueba.web.app/assets/logo.png" alt="Austin's Logo" style="max-width: 100px;">
        </div>
        <div style="text-align: center; padding: 20px;">
          <h2 style="font-size: 24px; color: #333;">Notificación de Cancelación de producto</h2>
          <p style="color: #555; font-size: 16px;">Estimado ${nombreCliente} Queremos informarte que lamentablemente hemos tenido que cancelar tu pedido de: </p>
          <p style="color: #555; font-size: 20px;">${nombreProducto}</p>
          <p style="color: #555; font-size: 16px;">debido a la falta de ingredientes o insumos necesarios para su elaboración. Nos disculpamos sinceramente por cualquier inconveniente que esto pueda causarte.</p>
        </div>
        <p style="text-align: center; color: #777; font-size: 14px;">Deseamos ofrecerte la opción de continuar con tu pedido una vez que los ingredientes o insumos estén disponibles nuevamente. Si estás dispuesto/a a esperar, haremos todo lo posible para completar tu pedido tan pronto como sea posible. Por favor, háznoslo saber respondiendo a este correo.</p>
      </div>
    </div>
  `,
        //text: `Tu código de autenticación es: ${codigo}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
            res.status(500).json({ error: 'Error al enviar el correo electrónico' });
        } else {
            console.log('Correo electrónico enviado:', info.response);
            res.status(200).json({ message: 'Correo electrónico enviado exitosamente' });
        }
    });
}

function correocancelarorden(req, res) {
    const { email, nombreCliente } = req.body;

    const mailOptions = {
        from: 'quickdinehub@gmail.com', // Cambiar por tu dirección de correo electrónico
        to: email,
        subject: 'Notificación de Cancelación de Orden',
        html: `
    <div style="background-color: #f5f5f5; padding: 20px; font-family: 'Arial', sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding: 20px;">
          <img src="https://qdh-interfazprueba.web.app/assets/logo.png" alt="Austin's Logo" style="max-width: 100px;">
        </div>
        <div style="text-align: center; padding: 20px;">
          <h2 style="font-size: 24px; color: #333;">Notificación de Cancelación de Orden</h2>
          <p style="color: #555; font-size: 16px;">Estimado ${nombreCliente} Lamentamos informarte que hemos tenido que cancelar tu orden debido a circunstancias imprevistas. Nos disculpamos sinceramente por cualquier inconveniente que esto pueda causarte.</p>
        </div>
        <p style="text-align: center; color: #777; font-size: 14px;">Si tienes alguna pregunta o necesitas más información sobre esta cancelación, no dudes en ponerte en contacto con nosotros. Estamos aquí para ayudarte en cualquier forma posible.</p>
      </div>
    </div>
  `,
        //text: `Tu código de autenticación es: ${codigo}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
            res.status(500).json({ error: 'Error al enviar el correo electrónico' });
        } else {
            console.log('Correo electrónico enviado:', info.response);
            res.status(200).json({ message: 'Correo electrónico enviado exitosamente' });
        }
    });
}

module.exports = {
    enviarCorreo,
    enviarCorreoAdvertencia,
    enviarCorreRestablecimiento,
    enviarCorreBloqueo,
    correocancelarproducto,
    correocancelarorden
};