import Joi from "joi";
import { ValidateError } from "../errores.js";

const validacionPublicacion = publicacion => {
    const publicacionSchema = Joi.object({
        titulo: Joi.string().required(),
        usuario: Joi.object().required(),
        animal: Joi.object().required()
    });
    
    const { error } = publicacionSchema.validate(publicacion);
    if (error) throw new ValidateError(error.details[0].message);

    }

export default {validacionPublicacion}