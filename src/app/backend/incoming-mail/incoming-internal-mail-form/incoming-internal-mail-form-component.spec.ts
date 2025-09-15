import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInternalMailFormComponent } from './incoming-internal-mail-form-component';

describe('IncomingInternalMailFormComponent', () => {
  let component: IncomingInternalMailFormComponent;
  let fixture: ComponentFixture<IncomingInternalMailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingInternalMailFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInternalMailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
