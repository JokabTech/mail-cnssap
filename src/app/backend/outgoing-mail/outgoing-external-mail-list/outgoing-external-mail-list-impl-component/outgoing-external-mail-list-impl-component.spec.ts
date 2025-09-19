import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingExternalMailListImplComponent } from './outgoing-external-mail-list-impl-component';

describe('OutgoingExternalMailListImplComponent', () => {
  let component: OutgoingExternalMailListImplComponent;
  let fixture: ComponentFixture<OutgoingExternalMailListImplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingExternalMailListImplComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingExternalMailListImplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
