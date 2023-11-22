import express from "express";
import ControllerPublicacion from "../controladores/controllerPublicacion.js";

class RouterPublicacion {
  constructor() {
    this.router = express.Router();
    this.controlador = new ControllerPublicacion();
  }

  start() {
    this.router.post("/crear", this.controlador.crearPublicacion);
    this.router.get("/obtener/:id", this.controlador.obtenerPublicacion);
    this.router.put("/actualizar/:id", this.controlador.actualizarPublicacion);
    this.router.put("/contar/:idUsuario", this.controlador.contarPublicacionesPorUsuario);
    this.router.delete("/eliminar/:id", this.controlador.eliminarPublicacion);
    this.router.delete("/usuario/:idUsuario", this.controlador.eliminarPublicacionesPorUsuario);
    this.router.get("/publicacionesUsuario/:idUsuario", this.controlador.publicacionesUsuario);
    this.router.get("/publicaciones", this.controlador.publicaciones);
    this.router.get("/buscar/:query", this.controlador.publicacionesPorString); 
    this.router.post("/solicitar", this.controlador.solicitar);
    return this.router;
  }
}

export default RouterPublicacion;
