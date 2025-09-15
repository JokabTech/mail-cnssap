import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInternalMailFormImplComponent } from './incoming-internal-mail-form-impl-component';

describe('IncomingInternalMailFormImplComponent', () => {
  let component: IncomingInternalMailFormImplComponent;
  let fixture: ComponentFixture<IncomingInternalMailFormImplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingInternalMailFormImplComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInternalMailFormImplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
