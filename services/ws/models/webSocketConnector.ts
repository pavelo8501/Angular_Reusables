import { BehaviorSubject, map, Observable, Subject } from "rxjs";
import { IConnectionContainer, ConnectionContainer } from "./connectionContainer";
import { User } from "../../../models/user/user";
import { IWSDataRequest, IWSBasicRequest } from "../request/wsRequests";
import { IDataReceiver } from "../models/wsSubscriber";
import { webSocket } from "rxjs/webSocket";

export class ConnectionSubscription<T>{
      

      private connector$ : WebSocketConnector;
      public connectionId:number =0;

      constructor(
            public connectionSubject:Observable<boolean>, 
            public dataSubject:Observable<T>, 
            parentConnector:WebSocketConnector
      ){
            this.connector$  = parentConnector;
      }

      openConnection(){
            
      }

}


export class WebSocketConnector {

      private user : User;
      private url: string;
      private connectionStatusSubject = new Subject<boolean>();
      private connectionContainers: IConnectionContainer[] = []

      constructor(url:string, user:User){
            this.url = url;
            this.user = user;
            this.connectionContainers = [];
      }

      private addContainer(container: IConnectionContainer):IConnectionContainer{
            let newId = this.connectionContainers.length + 1;
            container.containerId = newId;
            this.connectionContainers.push(container);
            return container;
      }

      addConnSubscription<T>(request:IWSBasicRequest, receiverMethod: IDataReceiver<T>):ConnectionSubscription<T>{

           let dataSubject : Subject<T>= new Subject<T>();
           let connStatusSubject : BehaviorSubject<boolean>  = new BehaviorSubject<boolean>(false);
           let openObserver = new Subject<Event>();
                  openObserver.pipe(map((_) => true)).subscribe(connStatusSubject);
           let closeObserver = new Subject<CloseEvent>(); 
                  closeObserver.pipe(map((_) => false)).subscribe(connStatusSubject)

            let websocket$ =  webSocket<IWSBasicRequest>({
                  url : this.url,
                  openObserver,
                  closeObserver,
                });
            
            let newContainer = new ConnectionContainer<T>(
                  receiverMethod,
                  request,
                  websocket$,
                  openObserver,
                  closeObserver
            );
            
            this.addContainer(newContainer);
            let result = new ConnectionSubscription<T>(connStatusSubject,dataSubject, this);
            result.connectionId = newContainer.containerId;
            console.log("New connection container created");
            console.log(result);
            return result;
      }

}