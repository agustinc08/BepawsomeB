import express from "express";
import ControladorAnimal from "../controladores/controllerAnimal.js";

class RouterAnimal {
  constructor(servicioAnimal) {
    this.router = express.Router();
    this.controlador = new ControladorAnimal(servicioAnimal);
  }

  start() {
    this.router.post("/crear", this.controlador.crearAnimal);
    this.router.get("/obtener/:id", this.controlador.obtenerAnimal);
    this.router.put("/actualizar/:id", this.controlador.actualizarAnimal);
    this.router.delete("/eliminar/:id", this.controlador.eliminarAnimal);
    this.router.post("/guardadoAdoptante/:id", this.controlador.guardarUsuarioAdoptante);
    return this.router;
  }
}

export default RouterAnimal;
