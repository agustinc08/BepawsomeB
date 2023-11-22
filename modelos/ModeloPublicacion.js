const ESTADOPUBLICACION = {
    ACTIVA: 'ACTIVA',
    CADUCADA: 'CADUCADA',
    INACTIVA: 'INACTIVA',
  };
  
  class Publicacion {
    constructor(titulo, usuario, animal) {
      this.fechaCreacion = new Date();
      this.fechaCaducidad = this.calcularFechaCaducidad();
      this.estadoPublicacion = ESTADOPUBLICACION.ACTIVA;
      this.titulo = titulo;
      this.usuario = usuario;
      this.animal = animal;
      this.interesados = [];
    }

    
    calcularFechaCaducidad() {
      const fechaCreacion = new Date(this.fechaCreacion);
      fechaCreacion.setDate(fechaCreacion.getDate() + 90);// Agrega 90 días a la fecha de creación
      return fechaCreacion;
    }
    
  }
  
  export default Publicacion;