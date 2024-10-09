
export  interface  IWSBasicRequest {
      action: string;
      module: string;
}

export interface WSRequestInterface<RequestDataType> {
      actionPath: string;
      action: string;
      module: string;
      data?: RequestDataType | RequestDataType[] | undefined;
}

