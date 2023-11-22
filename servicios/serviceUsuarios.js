import ModelUsuario from "../repositorios/repositorioUser.js";
import UserRequest from "../validacionRequest/userRequest.js";
import { InvalidCredentialsError,UsuarioNotFoundError } from "../errores.js";
import pushEmail from "../helpers/emailPassword.js";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken'
const SECRET_KEY = 'secretkey123'

const saltRounds = 10; // Número de rondas de sal (mayor es más seguro pero más lento)
import bcrypt from 'bcrypt'

class ServicioUsuario{

    constructor(){
        this.model = new ModelUsuario()
    }

    idObjeto = (id) => {
      try {
        return new ObjectId(id);
      } catch (error) {
        console.error("Error al convertir ID a ObjectId:", error);
        throw error; // Re-lanzar el error para manejarlo en la capa superior si es necesario
      }
    };

    register = async (usuario) =>{
      try{

        await UserRequest.validacionRegister(usuario)

        const validarEmail = await this.model.buscarEmail(usuario.mail)
        if (validarEmail){
          throw new InvalidCredentialsError("El email " + usuario.mail + " ya se encuentra registrado!")
        }
        
        //Encripto la contrasenia 
        const contraseniaEncryptada = await bcrypt.hash(usuario.password, saltRounds)
        usuario.password = contraseniaEncryptada
        
        return  await this.model.registro(usuario)
      }catch (error) {
        throw error;
      } 
      }

      login = async (usuario) => {
        try {
          
          UserRequest.validacionLogin(usuario);

          const user = await this.model.login(usuario);
          
        
          if (!user) {            
            throw new InvalidCredentialsError("El email " + usuario.mail + " no se encuentra registrado!");
          }
      
          if (user.bloqueado ) {
            throw new InvalidCredentialsError("Cuenta bloqueada. Por favor, restablece tu contraseña.");
          }

          const isPasswordValid = bcrypt.compareSync(usuario.password, user.password);
      
          if (!isPasswordValid) {
            // Incrementar el contador de intentos fallidos
            await this.model.incrementarIntentosFallidos(user._id);
            
            // Verificar si la cuenta debe bloquearse
            const usuarioActualizado = await this.obtenerUsuario(user._id);
      
            if (usuarioActualizado.intentosFallidos > 2) {
              await this.model.bloquearCuenta(user._id);
              // Aquí puedes tomar medidas adicionales, como bloquear la cuenta o enviar notificaciones
              throw new InvalidCredentialsError("Cuenta bloqueada. Por favor, restablece tu contraseña.");
            }
            
            throw new InvalidCredentialsError("Contraseña incorrecta");
          }
          await this.model.restablecerIntentosFallidos(user._id);
          return user;
        } catch (error) {
          throw error;
        }
      }

    obtenerUsuario = async (idUsuario) =>{
      try{
        const user = await this.model.buscarId(this.idObjeto(idUsuario))
        if(!user){
          throw new UsuarioNotFoundError("El usuario no encontrado")
        }
        return user
      }catch(error){
        throw error
      }
    }

    editarImagenPerfil = async (idUsuario ,imagenPerfil) =>{
      try {
        const user = await this.model.editarImagenPerfil(this.idObjeto(idUsuario),imagenPerfil)
        if(!user){
          throw new UsuarioNotFoundError("No se pudo editar la imagen de perfil")
        }
        return user
      }catch(error){
        throw error
      }
    }

    editarUsuario = async (idUsuario, usuario) => {
      try {
        UserRequest.validacionEdit(usuario);
        const userEditado = await this.model.editarUsuario(this.idObjeto(idUsuario), usuario);
        if (!userEditado) {
          throw new UsuarioNotFoundError("El usuario no se pudo modificar");
        }
    
        return userEditado;
      } catch (error) {
        throw error;
      }
    };

    eliminarUsuario = async (idUsuario) =>{
      try{
        const userEliminado = await this.model.eliminarUsuario(this.idObjeto(idUsuario))
        if(!userEliminado){
          throw new UsuarioNotFoundError("El usuario no eliminado")
        }
        return userEliminado 
      }catch(error){
        throw error
      }
    }

    eliminarSolicitud = async (idUsuario,idPublicacion) =>{
      try{
        const solicitudEliminada = await this.model.eliminarSolicitud(this.idObjeto(idUsuario),idPublicacion)
        if(!solicitudEliminada){
          throw new UsuarioNotFoundError("El solicitud no se elimino")
        }
        return solicitudEliminada 
      }catch(error){
        throw error
      }
    }

    recuperarContrasenia = async (nuevoDatos) =>{
      try {

        UserRequest.validacionRecuperar(nuevoDatos);

        const user = await this.model.buscarEmail(nuevoDatos.mail)
        if(!user){
          throw new InvalidCredentialsError("El usuario no se encuentra registrado!")
        }

        const data = {
          password: bcrypt.hashSync(nuevoDatos.password, 10)
        }  

        const userRecuperado = await this.model.editarUsuario(user._id, data)
        
        if(!userRecuperado){
          throw new InvalidCredentialsError("No se pudo recuperar la contraseña!")
        }
        await this.model.restablecerIntentosFallidos(user._id);
        return userRecuperado
      } catch (error) {
        throw error
      }
    }

    changePassword = async (mail) => {
      try {
         // Valida que se ingrese un mail
        if(mail == null || mail.length === 0) throw new InvalidCredentialsError({'message': 'Error con el mail proporcionado'})
        const validarUser = await this.model.buscarEmail(mail)
        //Validacion de registro del mail
        if (!validarUser) throw new UsuarioNotFoundError("El email " + mail + " no se encuentra registrado!")
        //mando link de cambio de contrasenia
        const passToken = jwt.sign({id: validarUser._id}, process.env.SECRET_KEY, {
          expiresIn: 10 * 60 // 10 minutes
        })
        const info = await pushEmail(mail, passToken);
        console.log(info);
        return info
      } catch (error) {
        throw error;
      }
    }

    guardarPublicacion = async (id,publicacion) =>{
      try {
        const user = await this.model.buscarId(this.idObjeto(id))
        if(!user){
          throw new UsuarioNotFoundError("El usuario no encontrado")
        }
        user.casita.publicaciones.push(publicacion)
        const userEditado = await this.model.editarUsuario(this.idObjeto(id), user);
        if(!userEditado){
          throw new UsuarioNotFoundError("El usuario no se pudo modificar");
        }
        return userEditado;
      } catch (error) {
        throw error
      }
    }

}

export default ServicioUsuario