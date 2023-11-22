import ServicioUsuario from "../servicios/serviceUsuarios.js";
import ServicioPublicacion from "../servicios/servicePublicacion.js";
import jwt from 'jsonwebtoken'
const SECRET_KEY = 'secretkey123'

class ControllerUsuario{

    constructor(){
        this.servicioUsuario = new ServicioUsuario()
        this.servicioPublicacion = new ServicioPublicacion()
    }

    register = async (req, res) => {
        const newUser = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            mail: req.body.mail,
            password: req.body.password,
            celular: req.body.celular,
            localidad: req.body.localidad,
            provincia: req.body.provincia,
            nacionalidad: req.body.nacionalidad,
            codigoPostal: req.body.codigoPostal
        }
        try {
            const user = await this.servicioUsuario.register(newUser);
            
            const expiresIn = 24 * 60 * 60;
            const accesToken = jwt.sign(
              {id: user._id},
              process.env.SECRET_KEY,
              {expiresIn : expiresIn}
            );

            const dataUser = {
              userRegistrado:user,
              accesToken: accesToken,
              expiresIn: expiresIn
            }

            res.status(200).json(dataUser);
        }
        catch (error) {
          res.status(401).json(error.message);
        }
      };

    login = async (req, res) => {
      const usuario = req.body;
      try {
        const user = await this.servicioUsuario.login(usuario);
        
        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
          expiresIn: expiresIn,
        });
        
        const dataUser = {
          userLogueado:user,
          accesToken: accessToken,
          expiresIn: expiresIn
        }
        
        res.status(200).json(dataUser);
      }catch(error){
        res.status(401).json(error.message);
      }
    }

    obtenerUsuario = async (req, res) => {
      const idUsuario = req.params.id;
      try {
        const user = await this.servicioUsuario.obtenerUsuario(idUsuario);
        res.status(200).json(user);
      } catch (error) {
        res.status(400).json(error.message);
      }
    }

    editarImagenPerfil = async(req,res)=>{
      const idUsuario = req.params.id;
      const imagenPerfil = req.body.imagenPerfil;
      try {
        const user = await this.servicioUsuario.editarImagenPerfil(idUsuario ,imagenPerfil);
        res.status(200).json(user);
      }catch(error){
        res.status(400).json(error.message);
      }
    } 
    
    editarUsuario = async (req, res) => {
      const idUsuario = req.params.id;
      const usuario = req.body;
      try {
      const user = await this.servicioUsuario.editarUsuario(idUsuario, usuario);
      
      if(user){
        await this.servicioPublicacion.actualizarPublicacionesDelUsuario(user);
      }      
      res.status(200).json(user);
      }catch(error){
        res.status(400).json(error.message);
      }
    }

    eliminarUsuario = async (req, res) => {
      const idUsuario = req.params.id;
      try {
        const user = await this.servicioUsuario.eliminarUsuario(idUsuario);
        await this.servicioPublicacion.eliminarPublicacionesPorUsuario(idUsuario)
        res.status(200).json(user);
      }catch(error){
        res.status(400).json(error.message);
      }
    }

    eliminarSolicitud = async (req, res) => {
      const idUsuario = req.params.id;
      const idPublicacion = req.body.publicacionId;
      console.log(idUsuario,idPublicacion);
      try {
        const solicitud = await this.servicioUsuario.eliminarSolicitud(idUsuario,idPublicacion);
        res.status(200).json(solicitud);
      }catch(error){
        res.status(400).json(error.message);
      }
    }

    recuperarContrasenia = async (req, res) => {
      // del request deberan pasarse los datos del usuario: mail y la nueva contrasenia 
      const nuevoDatos = {
        mail: req.body.mail,
        password: req.body.password
      }
      try {
        const user = await this.servicioUsuario.recuperarContrasenia(nuevoDatos);
        res.status(200).json(user);
      }catch(error){
        res.status(400).json(error.message);
      }
    }

    changePassword = async (req, res) => {
      try {
        const { mail } = req.body;
        // Busqueda del mail si existe o no 
        await this.servicioUsuario.changePassword(mail);

        res.status(200).json({'message': `Se envio un mail a ${mail} con un link para que puedas cambiar tu contrasenia.`});
      } catch (error) {
        res.status(401).json(error.message);
      }


    }
}

export default ControllerUsuario