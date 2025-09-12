import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingExternalMailFormItemComponent } from './incoming-external-mail-form-item-component';

describe('IncomingExternalMailFormItemComponent', () => {
  let component: IncomingExternalMailFormItemComponent;
  let fixture: ComponentFixture<IncomingExternalMailFormItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingExternalMailFormItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingExternalMailFormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
