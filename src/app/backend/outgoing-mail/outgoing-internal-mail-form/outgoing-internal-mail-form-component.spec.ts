import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingInternalMailFormComponent } from './outgoing-internal-mail-form-component';

describe('OutgoingInternalMailFormComponent', () => {
  let component: OutgoingInternalMailFormComponent;
  let fixture: ComponentFixture<OutgoingInternalMailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingInternalMailFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingInternalMailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
