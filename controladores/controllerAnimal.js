import ServicioAnimal from "../servicios/serviceAnimal.js";
import { ObjectId } from "mongoose";

class ControllerAnimal {
  constructor() {
    this.servicioAnimal = new ServicioAnimal();
  }
  crearAnimal = async (req, res) => {
    console.log(req.body.fotos);
    
    const nuevoAnimal = {
      nombre: req.body.nombre,
      fotos: req.body.fotos,
      edad: req.body.edad,
      tipoAnimal: req.body.tipoAnimal,
      descripcion: req.body.descripcion,
      sexo: req.body.sexo,
      pesoEnKg: req.body.pesoEnKg,
      ubicacion: req.body.ubicacion,
      oferente: req.body.oferente,
      historiaClinica: req.body.historiaClinica,
    };
    try {
      const animalCreado = await this.servicioAnimal.crearAnimal(nuevoAnimal);
      res.status(201).json(animalCreado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  };

  obtenerAnimal = async (req, res) => {
    const idAnimal = req.params.id;
    try {
      const animal = await this.servicioAnimal.obtenerAnimalPorId(idAnimal);
      res.status(200).json(animal);
    } catch (error) {
      res.status(404).json(error.message);
    }
  };

  actualizarAnimal = async (req, res) => {
    const idAnimal = req.params.id;
    const nuevosDatos = req.body;
    try {
      const animalActualizado = await this.servicioAnimal.actualizarAnimal(idAnimal, nuevosDatos);
      res.status(200).json(animalActualizado);
    } catch (error) {
      res.status(400).json(error.message);
    }
  };

  eliminarAnimal = async (req, res) => {
    const idAnimal = req.params.id;
    try {
      const animalEliminado = await this.servicioAnimal.eliminarAnimal(idAnimal);
      res.status(200).json(animalEliminado);
    } catch (error) {
      res.status(404).json(error.message);
    }
  };

  guardarUsuarioAdoptante = async (req, res) => {
    const idUsuario = req.body.idUsuario;
    const idAnimal = req.params.id;
    try {
      const animal = await this.servicioAnimal.guardarUsuarioAdoptante(idUsuario,idAnimal);
      res.status(200).json(animal);
    } catch (error) {
      res.status(404).json(error.message);
    }
  };
}
export default ControllerAnimal;
