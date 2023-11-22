import Casita from "../modelos/modeloCasita.js";

class Usuario {
    constructor(nombre, apellido, mail,password , celular, localidad, provincia, nacionalidad, codigoPostal) {
      this.nombre = nombre;
      this.apellido = apellido;
      this.mail = mail;
      this.password = password;
      this.celular = celular;
      this.localidad = localidad;
      this.provincia = provincia;
      this.nacionalidad = nacionalidad;
      this.codigoPostal = codigoPostal;
      this.imagenPerfil = "https://img2.freepng.es/20180331/khw/kisspng-computer-icons-user-clip-art-user-5abf13d4b67e20.4808850915224718927475.jpg";
      this.esAdmin = false;
      this.casita = new Casita();
      this.intentosFallidos = 0;
      this.bloqueado = false;
    }
  }
export default Usuario;