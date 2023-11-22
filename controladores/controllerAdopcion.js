import ServicioAdopcion from "../servicios/serviceAdopcion.js";
import { AdopcionRequestError, AdopcionNotFoundError } from "../errores.js";
class ControllerAdopcion {
  constructor() {
    this.servicioAdopcion = new ServicioAdopcion();
  }

  crearAdopcion = async (req, res) => {
    
    const idPublicacion=req.body.idPublicacion
    const idAdoptante=req.body.idInteresado

    console.log("datos para adopcion")
    console.log(idPublicacion + "id publicacion")
    console.log(idAdoptante + "id adoptante")
    try {
      const adopcionCreada = await this.servicioAdopcion.crearAdopcion(idPublicacion,idAdoptante);
      if(adopcionCreada){
        this.mandarMailAdopcion(idPublicacion,idAdoptante)
      }
      res.status(201).json(adopcionCreada);
    } catch (error) {
      res.status(400).json(error.message);
    }
  };
  

  mandarMailAdopcion = async (idPublicacion,idAdoptante)=>{
    try {
       await this.servicioAdopcion.mandarMailAdopcion(idPublicacion,idAdoptante)
    } catch (error) {
      throw new Error(error)
    }
  }

  obtenerAdopciones = async (req, res) => {
    try {
      const adopciones = await this.servicioAdopcion.obtenerAdopciones();
      res.status(200).json(adopciones);
    } catch (error) {
      res.status(404).json(error.message);
    }
  }
  obtenerAdopcion = async (req, res) => {
    const idUsuario = req.params.idUsuario;
    try {
      const adopcion = await this.servicioAdopcion.obtenerAdopcionPorUsuario(idUsuario);
      if (!adopcion) {
        throw new AdopcionNotFoundError(`Adopción para el usuario con ID ${idUsuario} no encontrada`);
      }
      res.status(200).json(adopcion);
    } catch (error) {
      res.status(404).json(error.message);
    }
  };

  actualizarAdopcion = async (req, res) => {
    const idUsuario = req.params.idUsuario;
    const nuevosDatos = req.body;
    try {
      const adopcionActualizada = await this.servicioAdopcion.actualizarAdopcion(idUsuario, nuevosDatos);
      res.status(200).json(adopcionActualizada);
    } catch (error) {
      res.status(400).json(error.message);
    }
  };

  eliminarAdopcion = async (req, res) => {
    const idUsuario = req.params.idUsuario;
    try {
      const adopcionEliminada = await this.servicioAdopcion.eliminarAdopcion(idUsuario);
      if (!adopcionEliminada) {
        throw new AdopcionNotFoundError(`Adopción para el usuario con ID ${idUsuario} no encontrada`);
      }
      res.status(200).json(adopcionEliminada);
    } catch (error) {
      res.status(404).json(error.message);
    }
  };
}

export default ControllerAdopcion;
