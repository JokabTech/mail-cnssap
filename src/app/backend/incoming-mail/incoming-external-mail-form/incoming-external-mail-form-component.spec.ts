import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingExternalMailFormComponent } from './incoming-external-mail-form-component';

describe('IncomingExternalMailFormComponent', () => {
  let component: IncomingExternalMailFormComponent;
  let fixture: ComponentFixture<IncomingExternalMailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingExternalMailFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingExternalMailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
