import { Inject, Injectable } from '@angular/core';
import { WebSocketConnector, WSConnectionMethod, WSDataSubscription } from './models/webSocketConnector';
import { WSRequestInterface } from './requests/wsRequests'
import { User, WSUserInterface } from '../../models/user/user';
import { WS_API_URL } from './../../tokens';
import { ErrorCodes, WSException } from './models/wsExceptions';
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

	private _user: WSUserInterface | undefined
	set user(user : WSUserInterface){
		this._user = user
	}


	public subscribeMethod<RequestDataType, ResponseDataType>(
		request: WSRequestInterface<RequestDataType>,
		user: WSUserInterface | undefined = undefined,
		subscriber: DataSubscriberInterface | undefined = undefined
		): WSDataSubscription<RequestDataType, ResponseDataType>{

		try {
			let existingConnection = this.connections.find(x => (x.request.actionPath == request.actionPath));
			if (existingConnection == undefined) {
				console.log("creating new connection")

				let consUser : User
				if(user == undefined){
					if(this._user == undefined){
						throw new WSException("user not initialized, and subscription method had no user specified", ErrorCodes.INCOMPLETE_SETUP)
					}
					consUser = this._user
				}else{
					consUser = user
				}


				let newConnection = new WebSocketConnector<RequestDataType, ResponseDataType>(consUser, request, undefined ,this);
				let newSubscription 
				if (subscriber != undefined){
					newSubscription = newConnection.addMethod(request, subscriber)
				}else{
					newSubscription = newConnection.addMethod(request, undefined)
				}
				
				this.connections.push(newConnection);
				return newSubscription.dataSubscription
			} else {
				let newSubscriptionOnExistingConnection = existingConnection.addMethod(request, undefined);
				return newSubscriptionOnExistingConnection.dataSubscription
			}
		} catch (exception) {
			if (exception instanceof WSException) {
				console.error(`Caught a custom exception: ${exception.message}, Code: ${exception.errorCode}`);
				throw new Error(exception.message);
			} else {
				console.error('Caught an unknown error:', exception);
				throw exception;
			}
		}
	}

  
	public addDataSubscription<RequestDataType,ResponseDataType>(
		user: WSUserInterface, 
		request: WSRequestInterface<RequestDataType>, 
		subscriber: DataSubscriberInterface): WSConnectionMethod<RequestDataType, ResponseDataType> {
		
		try{
			let existingConnection = this.connections.find(x => (x.request.actionPath == request.actionPath));
			if (existingConnection == undefined) {
				console.log("creating new connection") 
				let newConnection = new WebSocketConnector<RequestDataType, ResponseDataType>(user, request, subscriber, this);
			  	let newSubscription =	newConnection.addMethod(request,subscriber)
				this.connections.push(newConnection);
				return newSubscription
			}else{
				let newSubscriptionOnExistingConnection = existingConnection.addMethod(request, undefined);
				return newSubscriptionOnExistingConnection
			}
		}catch(exception){
			if (exception instanceof WSException) {
				console.error(`Caught a custom exception: ${exception.message}, Code: ${exception.errorCode}`);
				throw new Error(exception.message);
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
