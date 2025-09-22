import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingInternalMailListComponent } from './outgoing-internal-mail-list-component';

describe('OutgoingInternalMailListComponent', () => {
  let component: OutgoingInternalMailListComponent;
  let fixture: ComponentFixture<OutgoingInternalMailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingInternalMailListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingInternalMailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
