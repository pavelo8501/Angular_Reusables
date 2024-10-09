

export enum ErrorCodes {
    UNKNOWN_ERROR = 1000,
    NOT_FOUND = 1001,
    ALREADY_DEFINED = 1002,
}


export class WSException extends Error {
    
    errorCode: ErrorCodes
    
    constructor(message: string, errorCode:ErrorCodes) {
        super(message);
        this.name = 'WSException';
        this.errorCode = errorCode;
        Object.setPrototypeOf(this, WSException.prototype);
    }
}
