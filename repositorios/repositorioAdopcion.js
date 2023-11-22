import ConexionMongo from "./conexionMongoDb.js";
import Adopcion from "../modelos/modeloAdopcion.js";
import { DatabaseError } from "../errores.js";

class RepositorioAdopcion {
  constructor() {
    this.adopcionesCollection = null;
    this.init();
  }

  async init() {
    try {
      const conexionMongo = ConexionMongo.instance;
      if (conexionMongo) {
        this.adopcionesCollection = await conexionMongo.AdopcionesColeccion();
      } else {
        const nuevaConexionMongo = new ConexionMongo();
        await nuevaConexionMongo.conectar();
        this.adopcionesCollection = nuevaConexionMongo.AdopcionesColeccion();
      }
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async crearAdopcion(adopcion) {
    try {
      await this.adopcionesCollection.insertOne(adopcion);
      return adopcion;
    } catch (error) {
      throw new DatabaseError("Error al crear adopción: " + error);
    }
  }

  async obtenerAdopciones() {
    return await this.adopcionesCollection.find().toArray();
  }

  async obtenerAdopcionPorIdUsuario(idUsuario) {
    return await this.adopcionesCollection.findOne({ idUsuario: idUsuario });
  }

  async actualizarAdopcion(idUsuario, nuevosDatos) {
    try {
      await this.adopcionesCollection.updateOne({ idUsuario: idUsuario }, { $set: nuevosDatos });
      return await this.obtenerAdopcionPorIdUsuario(idUsuario);
    } catch (error) {
      throw new DatabaseError("Error al actualizar adopción: " + error);
    }
  }

  async eliminarAdopcion(idUsuario) {
    try {
      const adopcionEliminada = await this.obtenerAdopcionPorIdUsuario(idUsuario);
      await this.adopcionesCollection.deleteOne({ idUsuario: idUsuario });
      return adopcionEliminada;
    } catch (error) {
      throw new DatabaseError("Error al eliminar adopción: " + error);
    }
  }
}

export default RepositorioAdopcion;
