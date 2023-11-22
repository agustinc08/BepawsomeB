import ServicioPublicacion from "../servicios/servicePublicacion.js";
import ServicioUsuario from "../servicios/serviceUsuarios.js";
import { PublicacionRequestError, PublicacionNotFoundError } from "../errores.js";
import emailAdoption from '../helpers/emailAdoption.js'

class ControllerPublicacion {
  constructor() {
    this.servicioPublicacion = new ServicioPublicacion();
    this.servicioUsuario = new ServicioUsuario();
  }

  crearPublicacion = async (req, res) => {
    try {
    console.log(req.body.titulo);
    // crear publicacion recibiria del request un titulo y dos objetos a guardar, el usuario y el animal
    const nuevaPublicacion = {
      titulo: req.body.titulo,
      usuario: req.body.usuario,
      animal: req.body.animal,
    };
      console.log("hola");
      const publicacionCreada = await this.servicioPublicacion.crearPublicacion(nuevaPublicacion);
      // devolvemos el objeto publicacionCreada como respuesta
      console.log("hola 3");
      res.status(201).json(publicacionCreada);
    } catch (error) {
      res.status(400).json(error.message);
    }
  };

    async contarPublicacionesPorUsuario(req, res) {
    try {
      const { usuarioId } = req.params;
      const count = await this.service.contarPublicacionesPorUsuario(usuarioId);
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  obtenerPublicacion = async (req, res) => {
    const idPublicacion = req.params.id;
    try {
      const publicacion = await this.servicioPublicacion.obtenerPublicacionPorId(idPublicacion);
      if (!publicacion) {
        throw new PublicacionRequestError(`Publicacion con ID ${idPublicacion} no encontrada`);
      }
      res.status(200).json(publicacion);
    } catch (error) {
      res.status(404).json(error.message);
    }
  };

  actualizarPublicacion = async (req, res) => {
    const idPublicacion = req.params.id;
    const nuevosDatos = req.body;
    try {
      const publicacionActualizada = await this.servicioPublicacion.actualizarPublicacion(idPublicacion, nuevosDatos);
      res.status(200).json(publicacionActualizada);
    } catch (error) {
      res.status(400).json(error.message);
    }
  };

  eliminarPublicacion = async (req, res) => {
    const idPublicacion = req.params.id;
    try {
      const publicacionEliminada = await this.servicioPublicacion.eliminarPublicacion(idPublicacion);
      if (!publicacionEliminada) {
        throw new PublicacionNotFoundError(`Publicación con ID ${idPublicacion} no encontrada`);
      }
      res.status(200).json(publicacionEliminada);
    } catch (error) {
      res.status(404).json(error.message);
    }
  };

  eliminarPublicacionesPorUsuario = async (req, res) => {
    const idUsuario = req.params.idUsuario;
    console.log(idUsuario)
    try {
      const resultado = await this.servicioPublicacion.eliminarPublicacionesPorUsuario(idUsuario);
      console.log(resultado)
      if (resultado.deletedCount === 0) {
        throw new PublicacionNotFoundError(`No se encontraron publicaciones para el usuario con ID ${idUsuario}`);
      }
      res.status(200).json({ message: "Publicaciones eliminadas correctamente." });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  };

// va a devolver un array de todas las publicaciones de la base de datos
  publicaciones = async (req, res) => {
    try {
      const arrayPublicaciones = await this.servicioPublicacion.publicaciones();
      res.status(200).json(arrayPublicaciones);
    } catch (error) {
      res.status(404).json(error.message);
    }
  }

  publicacionesUsuario = async (req, res) => {
    try {
      const idUsuario = req.params.idUsuario; // Asegúrate de obtener el ID del usuario correctamente
      const array = await this.servicioPublicacion.publicacionesUsuario(idUsuario);
      res.status(200).json(array);
    } catch (error) {
      res.status(404).json(error.message);
    }
  };

  //Se buscaran publicaciones por palabras claves (String recibidos por parametros)
  publicacionesPorString = async (req, res) => {
    try {
      const string = req.params.query;
      console.log(string);
      const result = await this.servicioPublicacion.publicacionesPorString(string);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error en la API:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };

  // endpoint que responde al boton de 'Solicita Adopcion' 
  solicitar = async (req, res) => {
    try {
      const idAdoptante = req.body.idAdoptante;
      const idOferente = req.body.publicacion.usuario._id;
      const fechaCreacion = req.body.publicacion.fechaCreacion;
      //dataAnimal es el objeto completo del animal, se envia asi para sacar sus propiedades para enviarselas al oferente por mail
      const dataAnimal = req.body.publicacion.animal;
      //guardo la publicacion en la casita del adoptante
      const publicacionGuardad = await this.servicioUsuario.guardarPublicacion(idAdoptante, req.body.publicacion);
      if (!publicacionGuardad) {
        throw new PublicacionNotFoundError(`No se pudo guardar la publicacion en casita`);
      }
      const agregarInteresado= await this.servicioPublicacion.agregarInteresado(req.body.publicacion._id, idAdoptante);
      if (!agregarInteresado) {
        throw new PublicacionRequestError(`No se pudo agregar el interesado en publicacion`);  
      }  
      // se guardara un array con dos users, en la posicion 0 sera el de la persona interesada en solicitar y en la posicion 1 el del oferente
      const users = await this.servicioPublicacion.solicitar(idAdoptante, idOferente);
      if (!users) {
        throw new PublicacionRequestError(`No se pudo solicitar la publicacion`);
      }
      emailAdoption(users, dataAnimal, fechaCreacion);
      res.status(200).json({"message:" : `Solicitud enviada a ${users[1].mail}`})
    } catch (error) {
      res.status(404).json(error.message);
    }
  };
}

export default ControllerPublicacion;
