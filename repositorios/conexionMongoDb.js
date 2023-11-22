import mongoose from 'mongoose';

class ConexionMongo {
  constructor() {
    if (ConexionMongo.instance) {
      return ConexionMongo.instance;
    }

    this.url =
      'mongodb+srv://bepawsome:proyectbepawsome@cluster0.rk1ambn.mongodb.net/bePawsome';
    ConexionMongo.instance = this;
    this.conectar();
  }

  async conectar() {
    try {
      const conexion = await mongoose.connect(this.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Conectado a la base de datos');
    } catch (error) {
      console.log('No se pudo conectar a la base de datos:', error);
    }
  }

  usuariosColeccion() {
    this.usuariosDB = mongoose.connection.collection('Usuarios');
    return this.usuariosDB;
  }

  AnimalesColeccion() {
    this.animalesDB = mongoose.connection.collection('Animales');
    return this.animalesDB;
  }
  
  PublicacionesColeccion() {
    this.publicacionesDB = mongoose.connection.collection('Publicaciones');
    return this.publicacionesDB;
  }

  CasitaColeccion() {
    this.casitaDB = mongoose.connection.collection('Casita');
    return this.casitaDB;
  }

  AdopcionesColeccion() {
    this.adopcionesDB = mongoose.connection.collection('Adopciones');
    return this.adopcionesDB;
  }


}

export default ConexionMongo;
