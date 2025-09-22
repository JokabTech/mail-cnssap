import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingInternalMailListImplComponent } from './outgoing-internal-mail-list-impl-component';

describe('OutgoingInternalMailListImplComponent', () => {
  let component: OutgoingInternalMailListImplComponent;
  let fixture: ComponentFixture<OutgoingInternalMailListImplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingInternalMailListImplComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingInternalMailListImplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
