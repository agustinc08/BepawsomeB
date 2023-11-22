import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();



function pushEmail(users, dataAnimal, fechaCreacion) {

  const fechaPublicacion = new Date(fechaCreacion);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const fechaFormateada = fechaPublicacion.toLocaleDateString('es-ES', options);


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL,
      to: users[1].mail,
      subject: 'Solicitud de Interés de Adopción',
      text: 
      `Estimado ${users[1].nombre},\n

      Nos ponemos en contacto con usted para informarle el interés del usuario ${users[0].nombre} en solicitar una de sus adorables mascotas que tiene disponible para adopción.\n
      En esta oportunidad la mascota afortunada es ${dataAnimal.nombre}, publicado el: ${fechaFormateada}\n
      Acontinuacion le dejamos los datos para contactarse con el usuario interesado:\n
      - Nombre: ${users[0].nombre}\n
      - Mail: ${users[0].mail}\n
      - Celular: ${users[0].celular}\n

      Gracias por su dedicación y por brindar esta oportunidad de hacer una diferencia en la vida de un animal.\n
      \nAtentamente,\n
      El equipo de BePawsome`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo electrónico:', error);
        reject(error);
      } else {
        resolve({"message:" : `Solicitud enviada a ${users[1].mail}`});
      }
    });

}

export default pushEmail;
