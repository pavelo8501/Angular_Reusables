import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectablePartsInputComponent } from './selectable-parts-input.component';

describe('SelectablePartsInputComponent', () => {
  let component: SelectablePartsInputComponent;
  let fixture: ComponentFixture<SelectablePartsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectablePartsInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectablePartsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
