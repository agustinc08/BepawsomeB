import express from "express";
import ControladorAdopcion from "../controladores/controllerAdopcion.js";

class RouterAdopcion {
  constructor(servicioAdopcion) {
    this.router = express.Router();
    this.controlador = new ControladorAdopcion(servicioAdopcion);
  }

  start() {
    this.router.post("/crear", this.controlador.crearAdopcion);
    this.router.put("/actualizar/:idUsuario", this.controlador.actualizarAdopcion);
    this.router.delete("/eliminar/:idUsuario", this.controlador.eliminarAdopcion);
    this.router.get("/obtener", this.controlador.obtenerAdopciones);
    return this.router;
  }
}

export default RouterAdopcion;
