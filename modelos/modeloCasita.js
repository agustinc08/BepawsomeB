class Casita {
    constructor() {
      this.publicaciones = [];
      this.animalesAdoptados = [];
    }
  
    agregarPublicacion(publicacion) {
      this.publicaciones.push(publicacion);
    }
  
    eliminarPublicacion(publicacion) {
      this.publicaciones = this.publicaciones.filter((id) => id !== publicacion._id);
    }
  
    loAdopte(animal) {
      this.animalesAdoptados.push(animal);
    }
  }
  
  export default Casita;
  