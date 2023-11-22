import Joi from "joi";
import { ValidateError } from "../errores.js";

const validacionCasita = casita => {
    const CasitaSchema = Joi.object({
        publicaciones: Joi.array().items(Joi.number()).required(),
        animalesAdoptados: Joi.array().items(Joi.number()).required()
    });
    
    const { error } = CasitaSchema.validate(casita);
    if (error) throw new ValidateError(error.details[0].message);
}

export default { validacionCasita };
