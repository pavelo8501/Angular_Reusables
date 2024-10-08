import { Inject, Injectable } from '@angular/core';
import { WebSocketConnector } from './models/webSocketConnector';
import { User } from '../../models/user/user';
import { WS_API_URL } from './../../tokens';

@Injectable({
  providedIn: 'root'
})
export class WSService {

  connector : WebSocketConnector;

  //@Inject(WS_API_URL) private apiUrl: string

  constructor() { 

    let user = new User(1,"root", "root")
    let defaultUrl = "ws://localhost:8080/ws/contacts"
    this.connector = new WebSocketConnector(defaultUrl,user)

  }

}
