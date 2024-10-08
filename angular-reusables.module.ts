import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WS_API_URL} from './tokens'
import { WSService } from './services';

@NgModule({
  declarations: [
    
  ],
  providers:[
   // {provide: WS_API_URL, useValue: 'https://api.example.com' },
   WSService
  ],
  imports: [
    CommonModule,
  ],
  exports:[
    
  ]
})
export class AngularReusablesModule { }
