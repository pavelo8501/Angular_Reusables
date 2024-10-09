import { Inject, Injectable } from '@angular/core';
import { WebSocketConnector } from './models/webSocketConnector';
import { WSRequestInterface } from './requests/wsRequests'
import { User, WSUserInterface } from '../../models/user/user';
import { WS_API_URL } from './../../tokens';
import { WSException } from './models/wsExceptions';
import { DataSubscriberInterface } from './models/webSocketSubscriber';

@Injectable({
  providedIn: 'root'
})
export class WSService {

  private _baseUrl = "ws://localhost:8080/ws"
	private connections: WebSocketConnector<any,any>[] = [];

  constructor() { }


  get baseUrl(): string{
	return this._baseUrl;
  }
  set baseUrl(val:string){
	this._baseUrl = val;
  }

  public setBaseUrl(url:string){
    this.baseUrl = url;
  }

  public setUser(){

  }

  
	public addDataSubscription<RequestDataType,ResponseDataType>(
		user: WSUserInterface, 
		request: WSRequestInterface<RequestDataType>, 
		subscriber: DataSubscriberInterface<RequestDataType>) {
		
		try{
			let existingConnection = this.connections.find(x => (x.request.actionPath == request.actionPath));
			if (existingConnection == undefined) {
				console.log("creating new connection")
				let newConnection = new WebSocketConnector(user, request, subscriber, this);
				this.connections.push(newConnection);
			}else{

			}
		}catch(exception){
			if (exception instanceof WSException) {
				console.error(`Caught a custom exception: ${exception.message}, Code: ${exception.errorCode}`);
			} else {
				console.error('Caught an unknown error:', exception);
				throw exception;
			}
		}
	}

	public getConnections(): WebSocketConnector<any,any>[]{
		return this.connections
	}

}
