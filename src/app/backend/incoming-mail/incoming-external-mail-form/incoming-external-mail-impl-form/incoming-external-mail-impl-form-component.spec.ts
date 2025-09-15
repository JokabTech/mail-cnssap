import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingExternalMailImplFormComponent } from './incoming-external-mail-impl-form-component';

describe('IncomingExternalMailImplFormComponent', () => {
  let component: IncomingExternalMailImplFormComponent;
  let fixture: ComponentFixture<IncomingExternalMailImplFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingExternalMailImplFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingExternalMailImplFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
