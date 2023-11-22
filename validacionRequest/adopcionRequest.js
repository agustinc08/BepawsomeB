import Joi from "joi";
import { ValidateError } from "../errores.js";

const validacionAdopcion = adopcion => {
    const AdopcionSchema = Joi.object({
        descripcion: Joi.string().required(),
        oferente: Joi.string().required(),
        adoptante: Joi.string().required(),
        animal: Joi.object().required(),
        fechaAdopcion: Joi.date().required()
    });

    const { error } = AdopcionSchema.validate(adopcion);
    if (error) throw new ValidateError(error.details[0].message);
}

export default { validacionAdopcion };
