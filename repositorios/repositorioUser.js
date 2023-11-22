import ConexionMongo from "./conexionMongoDb.js";
import Usuario from "../modelos/modeloUsuarios.js"; 
import {DatabaseError} from "../errores.js";

class RepositorioUser{

    constructor(){
        this.usuariosCollection = null;
        this.init();
    }

    async init(){
        try{
            const conexionMongo = ConexionMongo.instance;
            if(conexionMongo){
                this.usuariosCollection = await conexionMongo.usuariosColeccion();
            }else{
                const nuevaConexionMongo = new ConexionMongo();
                await nuevaConexionMongo.conectar();
                this.usuariosCollection = nuevaConexionMongo.usuariosColeccion();
            }
        }catch(error){
            throw new DatabaseError(error)
        }
    }

    async registro(usuario){
        try{
            const newUser = new Usuario(
                usuario.nombre, usuario.apellido, usuario.mail, 
                usuario.password,usuario.celular, 
                usuario.localidad, usuario.provincia, 
                usuario.nacionalidad,usuario.codigoPostal)
                ;
                await this.usuariosCollection.insertOne(newUser);
            return newUser;
        }catch(error){
            throw new DatabaseError("Error al registrar usuario: " + error);
        }
    }

    async login(usuario){
        try{
            const user = await this.usuariosCollection.findOne({ mail: usuario.mail});
            return user;
        }catch(error){
            throw new DatabaseError("Error al loguear usuario: " + error);
        }
    }

    async incrementarIntentosFallidos(idUsuario) {
        try {
          const usuarioEditado = await this.usuariosCollection.findOneAndUpdate(
            { _id: idUsuario },
            { $inc: { intentosFallidos: 1 } },
            { returnDocument: 'after' } // Devuelve el documento después de la actualización
          );
      
          if (!usuarioEditado.value) {
            // Manejar el caso en el que no se encontró el usuario
            throw new DatabaseError("Usuario no encontrado");
          }
      
          return usuarioEditado.value;
        } catch (error) {
          throw new DatabaseError("Error al incrementar intentos fallidos: " + error);
        }
      }
      
      async restablecerIntentosFallidos(idUsuario) {
        try {
          const usuarioEditado = await this.usuariosCollection.findOneAndUpdate(
            { _id: idUsuario },
            { $set: { bloqueado: false, intentosFallidos: 0 } },
            { returnDocument: 'after' } // Devuelve el documento después de la actualización
          );
      
          if (!usuarioEditado.value) {
            // Manejar el caso en el que no se encontró el usuario
            throw new DatabaseError("Usuario no encontrado");
          }
      
          return usuarioEditado.value;
        } catch (error) {
          throw new DatabaseError("Error al restablecer intentos fallidos: " + error);
        }
      }

      async bloquearCuenta(idUsuario) {
        try {
          const usuarioEditado = await this.usuariosCollection.findOneAndUpdate(
            { _id: idUsuario },
            { $set: { bloqueado: true, intentosFallidos: 0 } },
            { returnDocument: 'after' } // Devuelve el documento después de la actualización
          );
      
          if (!usuarioEditado.value) {
            // Manejar el caso en el que no se encontró el usuario
            throw new DatabaseError("Usuario no encontrado");
          }
      
          return usuarioEditado.value;
        } catch (error) {
          throw new DatabaseError("Error al bloquear cuenta: " + error);
        }
      }
      
      

    async buscarEmail(mail){
        return await this.usuariosCollection.findOne({ mail: mail });
    }

    async buscarId(id){
        try{
            const user = await this.usuariosCollection.findOne({ _id: id });
            return user
        }catch(error){
            throw new DatabaseError("Error al buscar usuario: " + error);
        }
    }

    async editarImagenPerfil(idUsuario, imagenPerfil) {
        try {
            const response = await this.usuariosCollection.findOneAndUpdate(
                { _id: idUsuario },
                { $set: { imagenPerfil: imagenPerfil } },
                { returnDocument: 'after' }
            );
            console.log(response);
    
            if (response.lastErrorObject.updatedExisting) {
                // Si se modificó un documento, obtén el usuario actualizado
                return response.value;
            }
        } catch (error) {
            throw new DatabaseError("Error al editar imagen de perfil: " + error);
        }
    }
    async editarUsuario(id, campos) {
        try {
            const updateQuery = { $set: {} };
    
            // Agrega dinámicamente cada campo al objeto de actualización
            for (const campo in campos) {
                updateQuery.$set[campo] = campos[campo];
            }
    
            const response = await this.usuariosCollection.findOneAndUpdate(
                { _id: id },
                updateQuery,
                { returnDocument: 'after' }
            );
    

            if (response.lastErrorObject.updatedExisting) {
                // Si se modificó un documento, obtén el usuario actualizado
                return response.value;
            }
    
            return null;
        } catch (error) {
            throw new DatabaseError("Error al editar usuario: " + error);
        }
    }

    async eliminarUsuario(id){
        try{
            const userEliminado = await this.usuariosCollection.deleteOne({ _id: id });
            return userEliminado 
        }catch(error){
            throw new DatabaseError("Error al eliminar usuario: " + error);
        }
    //se le cambia la pass por la pasada por parametros
    }

    async eliminarSolicitud(idUsuario, idPublicacion) {
        try {
            // Buscar al usuario por su ID
            const usuario = await this.usuariosCollection.findOne({ _id: idUsuario });
            if (!usuario) {
                throw new DatabaseError("Usuario no encontrado");
            }
    
            // Filtrar las publicaciones para excluir la publicación que deseas eliminar
            const nuevasPublicaciones = usuario.casita.publicaciones.filter(
                (publicacion) => publicacion._id !== idPublicacion
            );
            console.log(nuevasPublicaciones);
            // Actualizar el usuario en la base de datos con las nuevas publicaciones
            const resultado = await this.usuariosCollection.updateOne(
                { _id: idUsuario },
                { $set: { "casita.publicaciones": nuevasPublicaciones } }
            );
    
            if (resultado.modifiedCount === 1) {
                // La actualización fue exitosa
                return { mensaje: "Solicitud eliminada correctamente" };
            } else {
                throw new DatabaseError("No se pudo eliminar la Solicitud");
            }
        } catch (error) {
            throw new DatabaseError("Error al eliminar Solicitud: " + error.message);
        }
    }
}

export default RepositorioUser