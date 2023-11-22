import ServicioCasita from "../servicios/serviceCasita.js"
import { CasitaRequestError } from "../errores.js";

class ControladorCasita {
  constructor() {
    this.servicioCasita = new ServicioCasita();
  }

  getAllPublicaciones = (req, res) => {
    res.status(200).json(this.servicioCasita.getAllPublicaciones());
  }

  agregarPublicacion = async (req, res) => {
    try {
      const idPublicacion = req.params.idPublicacion;

      // Verificar si el animal ya está en Casita antes de agregarlo
      const animalEnCasita = await this.servicioCasita.verificarAnimalEnCasita(idPublicacion);
      console.log('animalEnCasita:', animalEnCasita);
      if (animalEnCasita) {
        // Si el animal ya está en Casita, devuelve un error
        throw new Error("El animal ya está en Casita.");
      }

      // Si el animal no está en Casita, procede con la agregación
      await this.servicioCasita.agregarPublicacion(idPublicacion);
      res.status(200).send("Publicación agregada a la Casita.");
    } catch (error) {
      if (error.message === "El animal ya está en Casita.") {
        res.status(400).json({ error: "El animal ya está en Casita." });
      } else {
        res.status(500).json(new CasitaRequestError("Error al agregar publicación a Casita: " + error.message));
      }
    }
  };

  verificarAnimalEnCasita = async (req, res) => {
    try {
      const idPublicacion = req.params.idPublicacion; // Asegúrate de que estás obteniendo idPublicacion correctamente
      // Llama a la función correspondiente en el servicio para verificar si el animal está en Casita
      const animalEnCasita = await this.servicioCasita.verificarAnimalEnCasita(idPublicacion);
      console.log('animalEnCasita:', animalEnCasita);
      if (animalEnCasita && animalEnCasita.animal) {
        // Si el animal ya está en Casita, devuelve un error
        throw new Error("El animal ya está en Casita.");
      }
    } catch (error) {
      // Captura cualquier error y devuelve un mensaje de error
      console.error(error);
      res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
  }

  eliminarPublicacion = (req, res) => {
    try {
      const idPublicacion = req.params.idPublicacion;
      this.servicioCasita.eliminarPublicacion(idPublicacion);
      res.status(200).send("Publicación eliminada de la Casita.");
    } catch (error) {
      res.status(500).json(new CasitaRequestError("Error al eliminar publicación de Casita: " + error.message));
    }
  };

  loAdopte = (req, res) => {
    try {
      const idAnimal = req.params.idAnimal;
      this.servicioCasita.loAdopte(idAnimal);
      res.status(200).send("Animal adoptado y agregado a la Casita.");
    } catch (error) {
      res.status(500).json(new CasitaRequestError("Error al registrar adopción en Casita: " + error.message));
    }
  };
}

export default ControladorCasita;
