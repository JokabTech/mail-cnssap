import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingInternalMailListImplComponent } from './incoming-internal-mail-list-impl-component';

describe('IncomingInternalMailListImplComponent', () => {
  let component: IncomingInternalMailListImplComponent;
  let fixture: ComponentFixture<IncomingInternalMailListImplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomingInternalMailListImplComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingInternalMailListImplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
