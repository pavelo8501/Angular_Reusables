
export  interface  IWSBasicRequest {
      action: string;
      module: string;
}

export interface WSRequestInterface<RequestDataType> {
      actionPath: string;
      action: string;
      type: string;
      module?: string | undefined;
      data?: RequestDataType | RequestDataType[] | undefined;
}

