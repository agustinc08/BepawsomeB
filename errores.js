// creamos un error personalizado para cuando una credencial es inválida en el login o en el update
export class InvalidCredentialsError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidCredentialsError";
    }
}

export  class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DatabaseError";
    }
}
export  class ValidateError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidateError";
    }
}

export class UsuarioNotFoundError extends Error{
    constructor(message) {
        super(message);
        this.name = "UsuarioNotFoundError";
    }
}

export class PublicacionRequestError extends Error{
    constructor(message) {
        super(message);
        this.name = "PublicacionRequestError";
    }
}

export class PublicacionNotFoundError extends Error{
    constructor(message) {
        super(message);
        this.name = "PublicacionNotFoundError";
    }
}

export class AdopcionRequestError extends Error{
    constructor(message) {
        super(message);
        this.name = "AdopcionRequestError";
    }
}

export class AdopcionNotFoundError extends Error{
    constructor(message) {
        super(message);
        this.name = "AdopcionNotFoundError";
    }
}


export class AnimalRequestError extends Error{
    constructor(message) {
        super(message);
        this.name = "AnimalRequestError";
    }
}

export class AnimalNotFoundError extends Error{
    constructor(message) {
        super(message);
        this.name = "AnimalNotFoundError";
    }
}

export class CasitaRequestError extends Error{
    constructor(message) {
        super(message);
        this.name = "CasitaRequestError";
    }
}

export class CasitaNotFoundError extends Error{
    constructor(message) {
        super(message);
        this.name = "CasitaNotFoundError";
    }
}

export default {ValidateError,DatabaseError,UsuarioNotFoundError,PublicacionRequestError,
    PublicacionNotFoundError,AdopcionRequestError,AdopcionNotFoundError,AnimalRequestError,
    AnimalNotFoundError,CasitaRequestError,CasitaNotFoundError}