import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function pushEmail(mailDestinatario,passToken) {
  try {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
      },
    });

    const forgetURL = 'https://be-pawsome-git-main-agustins-projects-407208b8.vercel.app/signIn/cambiarContrasenia?token=' + passToken;

    const mailOptions = {
      from: process.env.MAIL,
      to: mailDestinatario,
      subject: 'Recupero de password para iniciar sesión',
      html:`<a href="${forgetURL}">Cambiar Contrasenia</a>`
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
