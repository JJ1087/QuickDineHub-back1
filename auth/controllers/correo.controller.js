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

module.exports = {
  enviarCorreo
};


