import { WSRequestInterface } from "../requests/wsRequests"


export interface WSResponseInterface<SourceDataType>{
    ok:boolean
    message:string|undefined
    errorCode:number|undefined
    result: SourceDataType | undefined
}

export interface WSResponseWithRequestInterface<ResponseDataType, RequestDataType> {
    
    request: WSRequestInterface<RequestDataType>
    
    ok: boolean
    message: string | undefined
    errorCode: number | undefined
    result: ResponseDataType | undefined
}


export interface WSServiceResponseInterface extends WSResponseInterface<undefined>{

    serviceMessage: string;

}

export class ServiceResponse implements WSServiceResponseInterface {


    ok: boolean
    serviceMessage: string
    errorCode : number | undefined
    
    message: undefined;
    result: undefined


    constructor(source: WSServiceResponseInterface){
        this.ok = source.ok;
        this.serviceMessage = source.serviceMessage;
        this.errorCode = source.errorCode;
    }
}