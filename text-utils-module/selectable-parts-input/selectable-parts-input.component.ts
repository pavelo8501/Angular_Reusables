import { Component, Input, input, signal, OnInit, effect, output, model, ModelSignal  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormGroupDirective, FormControl, NgForm, Validators, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup} from '@angular/forms';
import { SplitOverlayComponent } from './parts/split-overlay/split-overlay.component';
import {OverlayItem} from './models/overlayItem'

@Component({
  selector: 'selectable-parts-input',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    SplitOverlayComponent
  ],
  templateUrl: './selectable-parts-input.component.html',
  styleUrl: './selectable-parts-input.component.css'
})
export class SelectablePartsInputComponent implements OnInit {



  namedChunks: { [key: string]: string } = {}; 
   

  addressStr:string = ""

  //address = signal<string>("");


  splitRegExp = input<RegExp>();
  address = model<string>("");

  onParts = output()


  street: string = '';
  city: string = '';
  country: string = '';



  splitOverlays: OverlayItem[] = []

  showForm: boolean = false;



 ngOnInit(): void {
    if (this.address() != "") {
      this.splitAddress();
    }
  // effect.apply()
    
  }

  getNamedChunks() {
    return Object.entries(this.namedChunks).map(([key, value]) => ({ key, value }));
  }

  splitAddress() {

    if (this.splitRegExp() != undefined){
      const match = this.splitRegExp()!!.exec(this.address());

      if (match && match.groups) {
        this.namedChunks = match.groups; // Store the named groups (chunks)
        this.showForm = true; // Show the form once the address is split
      } else {
        console.error('Address format does not match the RegExp');
      }
    }

  }

  onInputChange(event:any){
    console.log("input changed ", event.target?.value??"");
    this.address.set(event.target?.value ?? "")

    this.splitAddress()
  }




}
