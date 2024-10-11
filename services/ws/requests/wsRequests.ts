
export  interface  IWSBasicRequest {
      action: string;
      module: string;
}

export interface WSRequestDataInterface<RequestDataType>{
      
      type:string
      value: RequestDataType | RequestDataType[] | undefined;
}

export interface WSRequestInterface<RequestDataType> {
      actionPath: string;
      action: string;
      subscriberId? :string | undefined; 
      module?: string | undefined;
     // data?: RequestDataType | RequestDataType[] | undefined;
      data?: WSRequestDataInterface<RequestDataType> | undefined;
}
