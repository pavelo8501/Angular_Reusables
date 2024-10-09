

export interface WSResponseInterface<SourceDataType>{
    ok:boolean
    message:string|undefined
    errorCode:number|undefined
    data: SourceDataType | undefined
}

export interface WSServiceResponseInterface extends WSResponseInterface<undefined>{

    serviceMessage: string;

}

export class ServiceResponse implements WSServiceResponseInterface {


    ok: boolean
    serviceMessage: string
    errorCode : number | undefined
    
    message: undefined;
    data: undefined


    constructor(source: WSServiceResponseInterface){
        this.ok = source.ok;
        this.serviceMessage = source.serviceMessage;
        this.errorCode = source.errorCode;
    }
}