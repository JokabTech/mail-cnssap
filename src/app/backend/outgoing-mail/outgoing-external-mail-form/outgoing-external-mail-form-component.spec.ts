import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingExternalMailFormComponent } from './outgoing-external-mail-form-component';

describe('OutgoingExternalMailFormComponent', () => {
  let component: OutgoingExternalMailFormComponent;
  let fixture: ComponentFixture<OutgoingExternalMailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingExternalMailFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingExternalMailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
