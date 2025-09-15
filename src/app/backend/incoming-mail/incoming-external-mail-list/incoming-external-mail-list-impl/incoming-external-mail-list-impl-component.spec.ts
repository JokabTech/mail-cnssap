import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingExternalMailListImplComponent } from './incoming-external-mail-list-impl-component';

describe('IncomingExternalMailListImplComponent', () => {
  let component: IncomingExternalMailListImplComponent;
  let fixture: ComponentFixture<IncomingExternalMailListImplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingExternalMailListImplComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingExternalMailListImplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
