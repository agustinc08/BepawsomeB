import express  from "express";
import bodyParser from "body-parser";
import cors from "cors";
import RouterUsuario from "./routers/usuarios.js";
import RouterPublicacion from "./routers/publicacion.js";
import RouterCasita from "./routers/casita.js";
import RouterAdopcion from "./routers/adopcion.js";
import RouterAnimal from "./routers/animal.js";


const app = express();
// facilidad de usar json
app.use(bodyParser.json());// para datos JSON
app.use(bodyParser.urlencoded({extended: true}));//para datos de formularios

//regula las solicitudes de un dominio diferente al servidor en el que se encuentra la app
app.use(cors());

// router de conexion a la base de datos
app.use('/usuarios', new RouterUsuario().start())
app.use('/publicacion', new RouterPublicacion().start())
app.use('/casita', new RouterCasita().start())
app.use('/adopcion', new RouterAdopcion().start())
app.use('/animal', new RouterAnimal().start())


const port = process.env.PORT || "https://bepawsome-e858795261d3.herokuapp.com";

app.listen(port, () => {
    console.log(`Servidor escuchando en https://bepawsome-e858795261d3.herokuapp.com:${port}`);
})