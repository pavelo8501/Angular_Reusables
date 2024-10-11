import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitOverlayComponent } from './split-overlay.component';

describe('SplitOverlayComponent', () => {
  let component: SplitOverlayComponent;
  let fixture: ComponentFixture<SplitOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplitOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SplitOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
