import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function pushEmail(adoptante,publicacion) {
  try {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
        from: process.env.MAIL,
        to: adoptante.mail,
        subject: 'Adopcion Realizada',
        text: `¡Hola ${adoptante.nombre}!\n\nTe alegrará saber que has logrado adoptar a ${publicacion.animal.nombre}.
         \n¡Felicidades por darle un hogar a esta encantadora mascota!\n\n¡Gracias por tu amor y cuidado hacia los animales!\n\nSaludos,
         \n Be-Pawsome`,
      };
      
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado:', info);

    return info.accepted;
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw error;
  }
}

export default pushEmail;
