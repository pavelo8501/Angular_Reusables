import { Observable } from "rxjs";

export interface DataSubscriberInterface<SourceData>{
    (data: SourceData): void;
}