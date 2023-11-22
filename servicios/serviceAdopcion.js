import AdopcionRepository from "../repositorios/repositorioAdopcion.js";
import { AdopcionRequestError } from "../errores.js";
import Adopcion from "../modelos/modeloAdopcion.js";
import UsuarioRepository from "../repositorios/repositorioUser.js";
import PublicacionRepository from "../repositorios/repositorioPublicacion.js";
import AnimalRepository from "../repositorios/repositorioAnimal.js";
import { ObjectId } from "mongodb";
import pushEmail from "../helpers/emailAdopcionRealizada.js";



class ServicioAdopcion {
  constructor() {
    this.repositoryAdopcion = new AdopcionRepository();
    this.repositorioUsuarios = new UsuarioRepository();
    this.repositorioPublicaciones = new PublicacionRepository();
    this.repositorioAnimal = new AnimalRepository();
  }


  idObjeto = (id) => {
    try {
      return new ObjectId(id);
    } catch (error) {
      console.error("Error al convertir ID a ObjectId:", error);
      throw error; // Re-lanzar el error para manejarlo en la capa superior si es necesario
    }
  };

  async crearAdopcion(idPublicacion,idAdoptante) {
    
    try {
      console.log("datos para adopcion")
      console.log(idPublicacion + "id publicacion")
      console.log(idAdoptante + "id adoptante") 
      const adoptante = await this.repositorioUsuarios.editarUsuario(this.idObjeto(idAdoptante));
      if (!adoptante) {
        throw new AdopcionRequestError(`Adpotante con ID ${idAdoptante} no encontrado`);
      }
      const publicacion = await this.repositorioPublicaciones.obtenerPublicacionPorId(this.idObjeto(idPublicacion));
      if (!publicacion) {
        throw new AdopcionRequestError(`Publicación con ID ${idPublicacion} no encontrada`);
      }
      const oferente = await this.repositorioUsuarios.buscarId(this.idObjeto(publicacion.usuario._id));
      if (!oferente) {
        throw new AdopcionRequestError(`Oferente no encontrado`);
      }
      const adopcion = new Adopcion(oferente, adoptante, publicacion);
      const nuevaAdopcion = await this.repositoryAdopcion.crearAdopcion(adopcion);
      if (!nuevaAdopcion) {
        throw new AdopcionRequestError(`Adopcion no realizada`);
      }
      
      const animalActualizado = await this.repositorioAnimal.guardarUsuarioAdoptante(this.idObjeto(publicacion.animal._id), adoptante)
      if (!animalActualizado) {
        throw new AdopcionRequestError(`Animal no actualizado`);
      }
      const datos = {
        estadoPublicacion: "INACTIVA",
        animal:animalActualizado
      }
      const publicacionActualizada = await this.repositorioPublicaciones.actualizarPublicacion(this.idObjeto(idPublicacion),datos)

      return {nuevaAdopcion, publicacionActualizada};
    } catch (error) {
      throw new AdopcionRequestError("Error al crear adopción: " + error.message);
    }
  }


  async mandarMailAdopcion(idPublicacion,idAdoptante){
    try {
      const adoptante = await this.repositorioUsuarios.buscarId(this.idObjeto(idAdoptante));
      const publicacion = await this.repositorioPublicaciones.obtenerPublicacionPorId(this.idObjeto(idPublicacion));

      pushEmail(adoptante,publicacion)
    } catch (error) {
      
    }
  }


  async obtenerAdopciones() {
    try {
      const adopciones = await this.repositoryAdopcion.obtenerAdopciones();
      return adopciones;
    } catch (error) {
      throw new AdopcionRequestError("Error al obtener adopciones: " + error.message);
    }
  }
  async obtenerAdopcionPorUsuario(idUsuario) {
    try {
      const adopcion = await this.repository.obtenerAdopcionPorIdUsuario(idUsuario);
      return adopcion;
    } catch (error) {
      throw new AdopcionRequestError("Error al obtener adopción: " + error.message);
    }
  }

  async actualizarAdopcion(idUsuario, nuevosDatos) {
    try {
      const adopcionActualizada = await this.repository.actualizarAdopcion(idUsuario, nuevosDatos);
      return adopcionActualizada;
    } catch (error) {
      throw new AdopcionRequestError("Error al actualizar adopción: " + error.message);
    }
  }

  async eliminarAdopcion(idUsuario) {
    try {
      const adopcionEliminada = await this.repository.eliminarAdopcion(idUsuario);
      return adopcionEliminada;
    } catch (error) {
      throw new AdopcionRequestError("Error al eliminar adopción: " + error.message);
    }
  }
}

export default ServicioAdopcion;
