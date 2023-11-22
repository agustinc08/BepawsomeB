 class Animal {
    constructor(nombre, fotos, edad, tipoAnimal, descripcion, sexo, pesoEnKg, ubicacion, oferente ,historiaClinica) {
      this.nombre = nombre;
      this.fotos = fotos;
      this.edad = edad;
      this.tipoAnimal = TIPOANIMAL[tipoAnimal];
      this.descripcion = descripcion;
      this.sexo = sexo;
      this.pesoEnKg = pesoEnKg;
      this.ubicacion = ubicacion;
      this.oferente = oferente;
      this.adoptante = null;
      this.historiaClinica = historiaClinica;
    }
  }

  const TIPOANIMAL = {
    PERRO: 'PERRO',
    GATO: 'GATO',
    CONEJO: 'CONEJO',
    REPTIL: 'REPTIL',
    VACA: 'VACA',
    PEZ: 'PEZ',
  };
  
  export default Animal