import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingMailGridComponent } from './outgoing-mail-grid-component';

describe('OutgoingMailGridComponent', () => {
  let component: OutgoingMailGridComponent;
  let fixture: ComponentFixture<OutgoingMailGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingMailGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingMailGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
