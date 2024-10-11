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


  addressStr:string = ""

  //address = signal<string>("");

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

  splitAddress() {
    const parts = this.address().split(',').map(part => part.trim());
    
    if (parts.length === 3) {
      this.street = parts[0];
      this.city = parts[1];
      this.country = parts[2];


      this.splitOverlays = [
        new OverlayItem("Street", this.street), 
        new OverlayItem("City", this.city), 
        new OverlayItem("Country", this.country)
      ]


      this.showForm = true;
    } else {
      console.error('Invalid address format');
    }

    // Emit the separated parts to parent component or form controls
    // this.partsEmitter.emit({
    //   street: this.street,
    //   city: this.city,
    //   country: this.country
    // });

  }

  onInputChange(event:any){
    console.log("input changed ", event.target?.value??"");
    this.address.set(event.target?.value ?? "")

    this.splitAddress()
  }




}
