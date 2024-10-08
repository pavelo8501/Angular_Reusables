import { Observable } from "rxjs";

export interface IDataReceiver<T>{
    (data: Observable<T>): void;
} 