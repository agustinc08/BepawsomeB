import ConexionMongo from "./conexionMongoDb.js";
import { DatabaseError } from "../errores.js";
import Casita from "../modelos/modeloCasita.js";

class RepositorioCasita {
  constructor() {
    this.init();
  }

  async init() {
    try {
      const conexionMongo = ConexionMongo.instance;
      if (conexionMongo) {
        this.casitaCollection = await conexionMongo.CasitaColeccion();
      } else {
        const nuevaConexionMongo = new ConexionMongo();
        await nuevaConexionMongo.conectar();
        this.casitaCollection = nuevaConexionMongo.CasitaColeccion();
      }
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async getAllPublicaciones() {
    try {
      return await this.casitaCollection.find({}).toArray();
    } catch (error) {
      throw new DatabaseError("Error al obtener publicaciones de Casita: " + error.message);
    }
  }

  async agregarPublicacion(idPublicacion) {
    try {
      //Si el animal no está en Casita, agregarlo
      await this.casitaCollection.insertOne({ publicacionId: idPublicacion });
    } catch (error) {
      throw new DatabaseError("Error al agregar publicación a Casita: " + error.message);
    }
  }
  

  async eliminarPublicacion(idPublicacion) {
    try {
      await this.casitaCollection.deleteOne({ publicacionId: idPublicacion });
    } catch (error) {
      throw new DatabaseError("Error al eliminar publicación de Casita: " + error.message);
    }
  }

  async loAdopte(idAnimal) {
    try {
      await this.casitaCollection.insertOne({ animalId: idAnimal });
    } catch (error) {
      throw new DatabaseError("Error al registrar adopción en Casita: " + error.message);
    }
  }
}

export default RepositorioCasita;
