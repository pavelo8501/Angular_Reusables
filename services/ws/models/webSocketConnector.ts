import { BehaviorSubject, map, Observable, Subject } from "rxjs";
import { User } from "../../../models/user/user";
import { WSRequestInterface } from "../requests/wsRequests";
import { DataSubscriberInterface } from "./webSocketSubscriber";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { WSResponseInterface, WSResponseWithRequestInterface, WSServiceResponseInterface } from "../responses/apiResponse";
import { WSService } from "../web-socket-service.service";
import { ErrorCodes, WSException } from "./wsExceptions";

type WSResponse<ResponseDataType> = WSResponseInterface<ResponseDataType> | WSServiceResponseInterface;

type WSMessage<RequestDataType, ResponseType> = WSRequestInterface<RequestDataType> | ResponseType;


export class WSDataSubscription<RequestDataType,ResponseDataType>{

      private parent : WSConnectionMethod<RequestDataType, ResponseDataType>
      public dataObservable: Observable<ResponseDataType>;

      constructor(dataSubject: Subject<ResponseDataType>, connectionMethod: WSConnectionMethod<RequestDataType, ResponseDataType>){
            this.parent = connectionMethod;
            this.dataObservable = dataSubject.asObservable();
      }

      public execute: (requestParam: RequestDataType | undefined) => Observable<ResponseDataType> = (requestParam: RequestDataType | undefined = undefined) => {
           
           this.parent.sendRequest(requestParam)
           return this.dataObservable;
      };
}

export class WSConnectionMethod<RequestDataType, ResponseDataType>{
      private parent: WebSocketConnector<RequestDataType, ResponseDataType>
      method: string
      subscriber: DataSubscriberInterface<ResponseDataType> | undefined = undefined;
      private request: WSRequestInterface<RequestDataType>
      private websocket : WebSocketSubject<WSMessage<RequestDataType, WSResponse < ResponseDataType >>>

      private dataSubject = new Subject<ResponseDataType>();
      public dataObservable = this.dataSubject.asObservable();

      public dataSubscription: WSDataSubscription<RequestDataType, ResponseDataType>;

      constructor(
            request: WSRequestInterface<RequestDataType>, 
            subscribrer: DataSubscriberInterface<ResponseDataType> | undefined,
            websocket: WebSocketSubject<WSMessage<RequestDataType, WSResponse<ResponseDataType>>>,
            parent: WebSocketConnector<RequestDataType, ResponseDataType>){
            this.request = request;
            this.method = request.action;
            this.subscriber = subscribrer;
            this.parent = parent;
            this.websocket = websocket;

            this.dataSubscription = new WSDataSubscription(this.dataSubject, this)
      }


      public submitData(data: ResponseDataType){

            if(this.subscriber!= undefined){
                  this.subscriber(data)
            }

            this.dataSubject.next((data as ResponseDataType))
      }

      public sendRequest(param: RequestDataType | undefined = undefined){
            try{
                  if (param!=undefined){
                        this.request.data = param
                  }
                  console.log("sending request: " + this.request);
                  this.websocket.next(this.request);

            } catch (e:any){
                  if (e instanceof Error) {
                        this.dataSubject.error(e.message);
                  } else {
                        this.dataSubject.error("An unknown error occurred");
                  }
            }
      }
}


export class WebSocketConnector<RequestDataType, ResponseDataType> {
      
      private websocket$: WebSocketSubject<WSMessage<RequestDataType, WSResponse<ResponseDataType>>>;

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
   
      constructor(user: User, request: WSRequestInterface<RequestDataType>, subscriber: DataSubscriberInterface<ResponseDataType>| undefined, serviss: WSService) {
            this.request = request;
            this.parent = serviss;
            this.user = user;
            this.websocket$ = this.initConnection(request, subscriber);
      }

      public addMethod(
            request: WSRequestInterface<RequestDataType>, 
            subscriber: DataSubscriberInterface<ResponseDataType> | undefined = undefined
      ): WSConnectionMethod<RequestDataType, ResponseDataType>{

            let existentMethod: WSConnectionMethod<any, any> | undefined ;
            if(subscriber == undefined){
                  existentMethod = this.webMethods.find(x => x.method == request.action);
            }else{
                  existentMethod = this.webMethods.find(x => x.method == request.action && subscriber == x.subscriber);
            }
                  
            if(existentMethod == undefined){
                  let newMethods = new WSConnectionMethod<RequestDataType, ResponseDataType>(request, subscriber, this.websocket$, this);
                  this.webMethods.push(newMethods);
                  console.log(`new web method: ${request.action} for subscriber created`);
                  return newMethods
            }else{
                  throw new WSException("Web method " + request.action +" for subscriber already exist",ErrorCodes.ALREADY_DEFINED);
            }
      }

      private initConnection(request: WSRequestInterface<RequestDataType>, subscriber: DataSubscriberInterface<ResponseDataType>| undefined = undefined): WebSocketSubject<WSMessage<RequestDataType, WSResponse<ResponseDataType>>> {
            
            
            let connStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
            let openObserver = new Subject<Event>();
            openObserver.pipe(map((_) => true)).subscribe(connStatusSubject);
            let closeObserver = new Subject<CloseEvent>();
            closeObserver.pipe(map((_) => false)).subscribe(connStatusSubject);

            let websocket$ = webSocket<WSMessage<RequestDataType, WSResponse<ResponseDataType>>>({
                  url: this.completeUrl,
                  openObserver,
                  closeObserver,
            });

            websocket$.subscribe({
                  next: (response) => {
                        if (this.isServiceMessage(response)) {
                              this.handleServiceMessage(response);
                        } else {
                              this.handleResponseMessage((response as WSResponseWithRequestInterface<ResponseDataType,RequestDataType>));
                        }
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
            return websocket$;
      }

      private isServiceMessage(message: WSMessage<RequestDataType, WSResponse<ResponseDataType>>): message is WSServiceResponseInterface {
            return (message as WSServiceResponseInterface).serviceMessage !== undefined;
      }

      private handleServiceMessage(message: WSServiceResponseInterface) {
            this.connected = true;
            console.log("Service message received", message.serviceMessage);
      }

      private handleResponseMessage(message: WSResponseWithRequestInterface<ResponseDataType,RequestDataType>) {
            console.log("Data message received:", message);
            if(message.ok){
                  let methodSubscribers = this.webMethods.filter(x => x.method == message.request.action);
                  if (message.result != undefined){
                        let dataReceived = message.result;
                        methodSubscribers.forEach(x => x.submitData(dataReceived))
                  }
            }
      }
}
