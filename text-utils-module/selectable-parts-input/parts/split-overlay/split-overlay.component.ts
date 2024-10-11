import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'split-overlay-part',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './split-overlay.component.html',
  styleUrl: './split-overlay.component.css'
})
export class SplitOverlayComponent {

  name = input<string>("")
  value = input<string>("")

}
