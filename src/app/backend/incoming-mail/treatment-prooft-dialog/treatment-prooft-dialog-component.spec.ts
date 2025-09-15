import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentProoftDialogComponent } from './treatment-prooft-dialog-component';

describe('TreatmentProoftDialogComponent', () => {
  let component: TreatmentProoftDialogComponent;
  let fixture: ComponentFixture<TreatmentProoftDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentProoftDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentProoftDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
