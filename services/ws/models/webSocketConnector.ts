import { BehaviorSubject, map, Observable, Subject } from "rxjs";
import { User } from "../../../models/user/user";
import { WSRequestInterface } from "../requests/wsRequests";
import { DataSubscriberInterface } from "./webSocketSubscriber";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { WSResponseInterface, WSServiceResponseInterface } from "../responses/apiResponse";
import { WSService } from "../web-socket-service.service";
import { ErrorCodes, WSException } from "./wsExceptions";

type WSResponse<ResponseDataType> = WSResponseInterface<ResponseDataType> | WSServiceResponseInterface;

type WSMessage<RequestDataType, ResponseType> = WSRequestInterface<RequestDataType> | ResponseType;

export class WSConnectionMethod<RequestDataType, ResponseDataType>{
      parent: WebSocketConnector<RequestDataType, ResponseDataType>
      method: string
      subscriber: DataSubscriberInterface<ResponseDataType>
      request: WSRequestInterface<RequestDataType>

      constructor(request: WSRequestInterface<RequestDataType>, subscribrer: DataSubscriberInterface<ResponseDataType>, parent: WebSocketConnector<RequestDataType, ResponseDataType>){
            this.request = request;
            this.method = request.action;
            this.subscriber = subscribrer;
            this.parent = parent;
      }

      public sendRequest(){
           
            this.parent.websocket$.next(this.request)
      }
}


export class WebSocketConnector<RequestDataType, ResponseDataType> {
      
      public websocket$: WebSocketSubject<WSMessage<RequestDataType, WSResponse<ResponseDataType>>>;

      private _connected: boolean = false;
      get connected(): boolean {
            return this._connected;
      }
      set connected(val: boolean) {
            if (val != this._connected) {
                  this._connected = val;
                  if (this.connected == true) {
                        console.log("connection open")
                  } else {
                        console.log("connection closed")
                  }
            }
      }

      get completeUrl(): string {
            return this.parent.baseUrl + this.request.actionPath;
      }

      private user: User;
      public request: WSRequestInterface<RequestDataType>
      private parent: WSService;

      private webMethods: WSConnectionMethod<RequestDataType, ResponseDataType>[] = [];
   
      constructor(user: User, request: WSRequestInterface<RequestDataType>, subscriber: DataSubscriberInterface<RequestDataType>, serviss: WSService) {
            this.request = request;
            this.parent = serviss;
            this.user = user;
            this.initConnection(request, subscriber);
      }

      public addMethod(request: WSRequestInterface<RequestDataType>, subscriber: DataSubscriberInterface<ResponseDataType>) {
            let existentMethod = this.webMethods.find(x => x.method == request.action && subscriber == x.subscriber);
            if(existentMethod == undefined){
                  let newMethods = new WSConnectionMethod<RequestDataType, ResponseDataType>(request, subscriber, this);
                  this.webMethods.push(newMethods);
                  console.log(`new web method: ${request.action} for subscriber created`);
            }else{
                  throw new WSException("Web method " + request.action +" for subscriber already exist",ErrorCodes.ALREADY_DEFINED);
            }
      }

      

      private initConnection(request: WSRequestInterface<RequestDataType>, subscriber: DataSubscriberInterface<RequestDataType>) {
            let connStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
            let openObserver = new Subject<Event>();
            openObserver.pipe(map((_) => true)).subscribe(connStatusSubject);
            let closeObserver = new Subject<CloseEvent>();
            closeObserver.pipe(map((_) => false)).subscribe(connStatusSubject);

            this.websocket$ = webSocket<WSMessage<RequestDataType, WSResponse<ResponseDataType>>>({
                  url: this.completeUrl,
                  openObserver,
                  closeObserver,
            });

            this.websocket$.subscribe({
                  next: (response) => {
                        if (this.isServiceMessage(response)) {
                              this.handleServiceMessage(response);
                              if (response.ok == true) {
                                    //this.addMethod(request, subscriber)
                              }
                        } else {
                              this.handleResponseMessage((response as WSResponseInterface<ResponseDataType>));

                        }
                        console.log(response)
                  },
                  error: (err) => {
                        console.error(err);
                  },
                  complete: () => {

                  }
            });

            connStatusSubject.subscribe({
                  next: (open) => {
                        this.connected = open
                  }
            })
      }

      private isServiceMessage(message: WSMessage<RequestDataType, WSResponse<ResponseDataType>>): message is WSServiceResponseInterface {
            return (message as WSServiceResponseInterface).serviceMessage !== undefined;
      }

      private handleServiceMessage(message: WSServiceResponseInterface) {
            this.connected = true;
            console.log("Service message received", message.serviceMessage);
      }

      private handleResponseMessage(message: WSResponseInterface<ResponseDataType>) {
            console.log("Data message received:", message);
      }
}


// export class WSConnection<RequestDataType> {

//       private _connected:boolean = false;
//       get connected(): boolean{
//             return this._connected;
//       }
//       set connected(val:boolean){
//             if(val!= this._connected){
//                   this._connected = val;
//                   if(this.connected == true){
//                         console.log("connection open")
//                   }else{
//                         console.log("connection closed")
//                   }
//             }
//       }

//       private user: User;
//       public request: WSRequestInterface<RequestDataType>
//       private parent: WSService;

//       private webMethods: WSConnectionMethod<RequestDataType>[] = [];

//       private websocket$: WebSocketSubject<WSResponse<RequestDataType>>


//       get completeUrl(): string {
//             return this.parent.baseUrl + this.request.actionPath;
//       }

//       constructor(user: User, request: WSRequestInterface<RequestDataType>, subscriber: DataSubscriberInterface<RequestDataType>, serviss: WSService) {
//             this.request = request;
//             this.parent = serviss;
//             this.user = user;
//             this.initConnection(request, subscriber);
//       }

//       public addMethod(request: WSRequestInterface<RequestDataType>, subscriber: DataSubscriberInterface<RequestDataType>){
//             let existentMethod = this.webMethods.find(x => x.method == request.action && subscriber == x.subscriber);
//             if(existentMethod == undefined){
//                   let newMethods = new WSConnectionMethod<RequestDataType>(request.action, subscriber, this);
//                   this.webMethods.push(newMethods);
//                   console.log(`new web method: ${request.action} for subscriber created`);
//             }else{
//                   throw new WSException("Web method " + request.action +" for subscriber already exist",ErrorCodes.ALREADY_DEFINED);
//             }
//       }

//       public sendRequest<RequestData>(request: WSRequestInterface<RequestData>){
//             this.websocket$.next(request)
//       }

//       private initConnection(request: WSRequestInterface<RequestDataType>, subscriber: DataSubscriberInterface<RequestDataType>) {
//             let connStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
//             let openObserver = new Subject<Event>();
//             openObserver.pipe(map((_) => true)).subscribe(connStatusSubject);
//             let closeObserver = new Subject<CloseEvent>();
//             closeObserver.pipe(map((_) => false)).subscribe(connStatusSubject);

//             this.websocket$  = webSocket<WSResponse<RequestDataType>>({
//                   url: this.completeUrl,
//                   openObserver,
//                   closeObserver,
//             });

//             this.websocket$.subscribe({
//                   next: (response) => {
//                         if (this.isServiceMessage(response)) {
//                               this.handleServiceMessage(response);
//                               if(response.ok == true){
//                                     this.addMethod(request, subscriber)
//                               }
//                         } else {
//                               this.handleResponseMessage(response);
//                         }
//                         console.log(response)
//                   },
//                   error: (err) => {
//                         console.error(err);
//                   },
//                   complete: () => {
                        
//                   }
//             });

//             connStatusSubject.subscribe({
//                   next:(open)=>{
//                         this.connected = open
//                   }
//             })
//       }

//       private isServiceMessage(message: WSResponse<any>): message is WSServiceResponseInterface {
//             return (message as WSServiceResponseInterface).serviceMessage !== undefined;
//       }

//       private handleServiceMessage(message: WSServiceResponseInterface) {
//             this.connected = true;
//             console.log("Service message received", message.serviceMessage);
//       }

//       private handleResponseMessage(message: WSResponseInterface<RequestDataType>) {
//             console.log("Data message received:", message);
//       }

// }