import RepositorioCasita from "../repositorios/repositorioCasita.js";

class ServicioCasita {
  constructor() {
    this.repositorio = new RepositorioCasita();
  }

  async getAllPublicaciones() {
    return await this.repositorio.getAllPublicaciones();
  }
  
  async agregarPublicacion(idPublicacion) {
    try {
      await this.repositorio.agregarPublicacion(idPublicacion);
    } catch (error) {
      throw new Error("Error al agregar publicación a Casita: " + error.message);
    }
  }

  async eliminarPublicacion(idPublicacion) {
    try {
      await this.repositorio.eliminarPublicacion(idPublicacion);
    } catch (error) {
      throw new Error("Error al eliminar publicación de Casita: " + error.message);
    }
  }

  async loAdopte(idAnimal) {
    try {
      await this.repositorio.loAdopte(idAnimal);
    } catch (error) {
      throw new Error("Error al registrar adopción en Casita: " + error.message);
    }
  }
}

export default ServicioCasita
