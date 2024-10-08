import { WebSocketSubject } from "rxjs/webSocket";
import { User } from "../../../models/user/user";
import { Subject } from "rxjs";
import { IWSBasicRequest } from "../request/wsRequests";
import { IDataReceiver } from "./wsSubscriber";


export interface IConnectionContainer{
       containerId : number
       connection  : WebSocketSubject<IWSBasicRequest>;
       openObserver : Subject<Event>;
       closeObserver : Subject<CloseEvent>;
}

export class ConnectionContainer<T> implements IConnectionContainer{
       
       public containerId: number = 0;
       
       private receiversMethod : IDataReceiver<T>
       private connectionRequestContext : IWSBasicRequest

       constructor(
              method : IDataReceiver<T>,
              request : IWSBasicRequest,
              public connection:WebSocketSubject<IWSBasicRequest>, 
              public openObserver:Subject<Event>, 
              public closeObserver:Subject<CloseEvent>
       ){
              this.receiversMethod = method;
              this.connectionRequestContext = request;
              
       }

}
