import AnimalRepository from "../repositorios/repositorioAnimal.js";
import { AnimalRequestError } from "../errores.js";
import ServicioUsuario from "./serviceUsuarios.js";
import animalRequest from "../validacionRequest/animalRequest.js";
import { ObjectId } from "mongodb";
//import uploadImages from "../cloudinary.js"


class ServicioAnimal {
  constructor() {
    this.repository = new AnimalRepository();
    this.servicioUsuario = new ServicioUsuario();
  }

  idObject = (id) => {
    return new ObjectId(id);
  }

  async crearAnimal(animal) {
    try {
      animalRequest.validacionAnimal(animal);
      const nuevoAnimal = await this.repository.crearAnimal(animal);
      return nuevoAnimal;
    } catch (error) {
      throw new AnimalRequestError("Error al crear animal: " + error.message);
    }
  }

  async obtenerAnimalPorId(idAnimal) {
    try {
      const animal = await this.repository.obtenerAnimalPorId(idAnimal);
      if (!animal) {
        throw new AnimalRequestError(`Animal con ID ${idAnimal} no encontrado`);
      }
      return animal;
    } catch (error) {
      throw new AnimalRequestError("Error al obtener animal: " + error.message);
    }
  }

  async actualizarAnimal(idAnimal, nuevosDatos) {
    try {
      const animalActualizado = await this.repository.actualizarAnimal(idAnimal, nuevosDatos);
      return animalActualizado;
    } catch (error) {
      throw new AnimalRequestError("Error al actualizar animal: " + error.message);
    }
  }

  async eliminarAnimal(idAnimal) {
    try {
      const animalEliminado = await this.repository.eliminarAnimal(idAnimal);
      if (!animalEliminado) {
        throw new AnimalRequestError(`Animal con ID ${idAnimal} no encontrado`);
      }
      return animalEliminado;
    } catch (error) {
      throw new AnimalRequestError("Error al eliminar animal: " + error.message);
    }
  }

  async guardarUsuarioAdoptante(idUsuario,idAnimal) {
    try {
      //busco el usuario que va a solicitar
      const user = await this.servicioUsuario.obtenerUsuario(idUsuario);
      if(!user){
        throw new AnimalRequestError(`Usuario con ID ${idUsuario} no encontrado`);
      }
      //guardo el usuario que va a solicitar en la base de datos del animal
      const animalAdoptado = await this.repository.guardarUsuarioAdoptante(this.idObject(idAnimal),user);
      if(!animalAdoptado){
        throw new AnimalRequestError(`No se pudo guardar el usuario`);
      }
      //devuelvo el animal adoptado
      return animalAdoptado
    } catch (error) {
      throw new AnimalRequestError("Error al solicitar animal: " + error.message);
    }
  }
}

export default ServicioAnimal;
