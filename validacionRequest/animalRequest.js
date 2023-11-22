import Joi from "joi";
import { ValidateError } from "../errores.js";

const animalesValidos = ['PERRO', 'GATO', 'CONEJO', 'REPTIL', 'VACA', 'PEZ'];
const sexoValidacion = ['MACHO', 'HEMBRA'];

const validacionAnimal = animal => {
    const AnimalSchema = Joi.object({
        nombre: Joi.string().required(),
        fotos: Joi.array().items(Joi.string()).required(),
        edad: Joi.number().integer().required(),
        tipoAnimal: Joi.string().valid(...animalesValidos).required(),
        descripcion: Joi.string().required(),
        sexo: Joi.string().valid(...sexoValidacion).required(),
        pesoEnKg: Joi.number().required(),
        ubicacion: Joi.string().required(),
        oferente: Joi.object().required(),
        historiaClinica: Joi.string().required()
    });

    const { error } = AnimalSchema.validate(animal, { allowUnknown: true });
    if (error) throw new ValidateError(error.details[0].message);
}

export default { validacionAnimal }
