import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingExternalMailListComponent } from './outgoing-external-mail-list-component';

describe('OutgoingExternalMailListComponent', () => {
  let component: OutgoingExternalMailListComponent;
  let fixture: ComponentFixture<OutgoingExternalMailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingExternalMailListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingExternalMailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
