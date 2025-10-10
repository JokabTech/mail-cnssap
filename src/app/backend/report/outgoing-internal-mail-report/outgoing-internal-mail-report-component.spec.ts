import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingInternalMailReportComponent } from './outgoing-internal-mail-report-component';

describe('OutgoingInternalMailReportComponent', () => {
  let component: OutgoingInternalMailReportComponent;
  let fixture: ComponentFixture<OutgoingInternalMailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingInternalMailReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingInternalMailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
