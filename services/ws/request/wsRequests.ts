
export  interface  IWSBasicRequest {
      action: string;
      module: string;
}

export  interface  IWSDataRequest<T> {
      action: string;
      module: string;
      data: T;
}